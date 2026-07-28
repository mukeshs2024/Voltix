from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.realtime_service import ws_manager

router = APIRouter(tags=["WebSockets"])


@router.websocket("/ws")
async def websocket_global(websocket: WebSocket):
    await ws_manager.connect(websocket, channel="global")
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming socket messages
            await ws_manager.send_personal_message({"status": "received", "data": data}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel="global")


@router.websocket("/ws/{channel}")
async def websocket_channel(websocket: WebSocket, channel: str):
    await ws_manager.connect(websocket, channel=channel)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message({"status": "received", "channel": channel, "data": data}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel=channel)
