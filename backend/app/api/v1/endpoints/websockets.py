from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from backend.app.services.realtime_service import ws_manager
from backend.app.services.digital_twin_engine import simulation_engine

router = APIRouter(tags=["WebSockets"])

# Register simulation engine update subscriber for WebSocket streaming
async def _on_twin_update(state):
    payload = {
        "type": "digital_twin_update",
        "data": state.model_dump()
    }
    await ws_manager.broadcast(payload, channel="digital_twin")

simulation_engine.register_subscriber(_on_twin_update)


@router.websocket("/ws")
async def websocket_global(websocket: WebSocket):
    await ws_manager.connect(websocket, channel="global")
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message({"status": "received", "data": data}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel="global")


@router.websocket("/ws/digital-twin")
async def websocket_digital_twin(websocket: WebSocket):
    await ws_manager.connect(websocket, channel="digital_twin")
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message({"status": "connected", "channel": "digital_twin"}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel="digital_twin")


@router.websocket("/ws/{channel}")
async def websocket_channel(websocket: WebSocket, channel: str):
    await ws_manager.connect(websocket, channel=channel)
    try:
        while True:
            data = await websocket.receive_text()
            await ws_manager.send_personal_message({"status": "received", "channel": channel, "data": data}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, channel="channel")

