"""
IDE Resolution Proxy
This file exists solely to help the IDE resolve 'from ai.state import AgentState' 
when the workspace root is the parent directory, due to the namespace collision 
between the 'ai' root folder and the 'ai' sub-package.
"""
from .ai.state import *
