from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

# Change to the directory containing index.html
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Create server
server_address = ('', 8000)  # Port 8000
httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
print("Server started at http://localhost:8000")
httpd.serve_forever() 