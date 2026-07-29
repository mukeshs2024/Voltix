import asyncio
import websockets
import json

async def test_ws():
    uri = "ws://localhost:8000/api/v1/ws/simulation"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
            # Receive a message
            for _ in range(3):
                response = await websocket.recv()
                print("Received:", response[:200] + "...")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test_ws())
