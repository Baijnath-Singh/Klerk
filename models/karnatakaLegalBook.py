# models/knowledge_base.py

from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
import uuid

class KarnatakaLegalBook(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias='_id')
    category: str
    question: str
    answer: str
    source: str
    tags: List[str]

    class Config:
        allow_population_by_field_name = True

class KarnatakaLegalBookList(BaseModel):
    """
    The KnowledgeDocumentList class represents a list of documents.
    This class is used when deserializing a collection/array
    of documents.
    """
    items: List[KarnatakaLegalBook]


