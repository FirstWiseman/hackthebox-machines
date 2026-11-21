import socket
import struct
import os
import stat
import fcntl

path = "/run/paperwork/mgmt.sock"

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
    sock.connect(path)

    data, ancillary, flags, address = sock.recvmsg(
        4096,
        socket.CMSG_SPACE(256)
    )

    print("Message:", data.decode(errors="replace"))
    print("Flags:", flags)

    for level, kind, payload in ancillary:
        print("Control level:", level)
        print("Control type:", kind)
        print("Control payload size:", len(payload))

        if level == socket.SOL_SOCKET and kind == socket.SCM_RIGHTS:
            print("SCM_RIGHTS Payload:", repr(payload))
            print("Payload Length:", len(payload))
            arr = struct.unpack("<2i", payload)
            fd1 = arr[0]
            fd2 = arr[1]
            
            content1 = os.pread(fd1, 4096, 0)
            content2 = os.pread(fd2, 4096, 0)

            print(content1.decode("utf-8", errors="replace"))
            print(content2.decode("utf-8", errors="replace"))
