# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionProvideResourceLinks(Action):
    """Action to provide general resource links"""
    
    def name(self) -> Text:
        return "action_provide_resource_links"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        # Send message with links to resources
        dispatcher.utter_message(
            text="Here are some helpful resources for you:",
            json_message={
                "custom": {
                    "links": [
                        {
                            "text": "View All Resources",
                            "route": "/resources"
                        },
                        {
                            "text": "Emergency Support",
                            "route": "/resources",
                            "category": "emergency"
                        },
                        {
                            "text": "Educational Content",
                            "route": "/resources",
                            "category": "education"
                        }
                    ]
                }
            }
        )
        
        return []

class ActionProvideAnxietyResources(Action):
    """Action to provide anxiety-specific resources"""
    
    def name(self) -> Text:
        return "action_provide_anxiety_resources"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="I understand you're dealing with anxiety. Here are some resources that might help:",
            json_message={
                "custom": {
                    "links": [
                        {
                            "text": "Breathing Exercises",
                            "route": "/resources",
                            "category": "exercises"
                        },
                        {
                            "text": "Understanding Anxiety",
                            "route": "/resources",
                            "category": "education"
                        },
                        {
                            "text": "Crisis Support",
                            "route": "/resources",
                            "category": "emergency"
                        }
                    ]
                }
            }
        )
        
        return []

class ActionProvideCrisisResources(Action):
    """Action to provide crisis support resources"""
    
    def name(self) -> Text:
        return "action_provide_crisis_resources"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="I'm concerned about you. Please reach out for immediate support:",
            json_message={
                "custom": {
                    "links": [
                        {
                            "text": "Emergency Support",
                            "route": "/resources",
                            "category": "emergency"
                        },
                        {
                            "text": "Crisis Hotline",
                            "url": "tel:988"
                        },
                        {
                            "text": "Community Support",
                            "route": "/resources",
                            "category": "community"
                        }
                    ]
                }
            }
        )
        
        return []

class ActionProvideWellnessResources(Action):
    """Action to provide wellness and self-care resources"""
    
    def name(self) -> Text:
        return "action_provide_wellness_resources"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        dispatcher.utter_message(
            text="Here are some wellness resources to help you feel better:",
            json_message={
                "custom": {
                    "links": [
                        {
                            "text": "Wellness Exercises",
                            "route": "/resources",
                            "category": "exercises"
                        },
                        {
                            "text": "Guided Meditation",
                            "route": "/resources",
                            "category": "exercises"
                        },
                        {
                            "text": "Educational Content",
                            "route": "/resources",
                            "category": "education"
                        }
                    ]
                }
            }
        )
        
        return []
