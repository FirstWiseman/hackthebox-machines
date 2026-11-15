from http.server import HTTPServer, BaseHTTPRequestHandler

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        print("METHOD:", self.command)
        print("PATH:", repr(self.path))
        print("HEADERS:", self.headers)

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"REQUEST_CAPTURED")

HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
