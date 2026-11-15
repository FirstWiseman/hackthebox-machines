import asyncio
import json
import websockets

async def main():
    uri = "ws://db.htb-airport.htb/webterminal"

    try:
        async with websockets.connect(
            uri,
            open_timeout=5
        ) as ws:
            print("WebSocket connected!")

            await ws.send(json.dumps({
                "type": "auth",
                "password": ""
            }))

            while True:
                response = await asyncio.wait_for(
                    ws.recv(),
                    timeout=5
                )
                print("Response:", repr(response))

    except Exception as e:
        print(type(e).__name__, str(e))

asyncio.run(main())
