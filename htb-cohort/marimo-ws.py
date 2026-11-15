
import os
import sys
import ssl
import tty
import select
import termios
import threading
import websocket

URL = "wss://nb-1be3782a8afd3ad5.cohort.htb/terminal/ws"

ws = websocket.create_connection(
    URL,
    timeout=10,
    sslopt={"cert_reqs": ssl.CERT_NONE}
)

print("[+] WebSocket connected")
print("[+] Interactive terminal ready")
print("[*] Press Ctrl+] to disconnect\n")

stop = threading.Event()

def receive_output():
    ws.settimeout(0.5)

    while not stop.is_set():
        try:
            message = ws.recv()

            if not message:
                break

            if isinstance(message, bytes):
                sys.stdout.buffer.write(message)
            else:
                sys.stdout.write(message)

            sys.stdout.flush()

        except websocket.WebSocketTimeoutException:
            continue
        except websocket.WebSocketConnectionClosedException:
            break
        except Exception:
            break

    stop.set()


reader = threading.Thread(
    target=receive_output,
    daemon=True
)
reader.start()

fd = sys.stdin.fileno()
old_settings = termios.tcgetattr(fd)

try:
    tty.setraw(fd)

    while not stop.is_set():
        readable, _, _ = select.select(
            [sys.stdin], [], [], 0.1
        )

        if not readable:
            continue

        data = os.read(fd, 1024)

        if not data or data == b"\x1d":
            break

        ws.send(data.decode("utf-8", errors="replace"))

except (
    KeyboardInterrupt,
    websocket.WebSocketConnectionClosedException
):
    pass

finally:
    stop.set()
    termios.tcsetattr(
        fd,
        termios.TCSADRAIN,
        old_settings
    )
    ws.close()
    print("\n[*] Disconnected")

