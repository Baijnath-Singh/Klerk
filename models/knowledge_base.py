# models/knowledge_base.py

from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class KnowledgeDocument(BaseModel):
    id: str = Field(..., alias='_id')
    category: str
    question: str
    answer: str
    source: str
    tags: List[str]
    timestamp: datetime

    class Config:
        allow_population_by_field_name = True

