#!/usr/bin/env python3
"""Adds a `group` field to every existing conversation topic, clustering
the 15 general-purpose topics (Phase 6) into 3 scenario-based groups and
keeping the 10 Safety Officer topics (Phase 9) as their own dedicated
group -- per the group-restructuring phase. The new Office Communication
topics (Part 3) are authored directly with group: "office_communication"
in their own script, not touched here."""
import json

PATH = "src/data/conversations.json"

GROUP_OF = {
    # travel -- navigation, hotel, airport, taxi (transportation folded in,
    # reads more naturally as one "getting around" cluster than splitting)
    "ask-directions": "travel",
    "hotel-checkin": "travel",
    "airport-checkin": "travel",
    "taxi-ride": "travel",
    # shopping_services -- transactional/errand scenarios: ordering,
    # buying, banking, lost item, doctor visit, classroom (all "visiting
    # a place and dealing with a person providing a service" scenarios)
    "order-food": "shopping_services",
    "clothes-shopping": "shopping_services",
    "bank-visit": "shopping_services",
    "lost-item": "shopping_services",
    "doctor-visit": "shopping_services",
    "classroom": "shopping_services",
    # social -- informal social/small-talk scenarios
    "new-friend": "social",
    "weekend-plans": "social",
    "weather-smalltalk": "social",
    "birthday-invite": "social",
    "phone-call": "social",
    # safety_officer -- Phase 9's 10 topics, own dedicated group
    "report-accident": "safety_officer",
    "ask-coworker-injury": "safety_officer",
    "near-miss": "safety_officer",
    "sudden-illness": "safety_officer",
    "evacuation-procedure": "safety_officer",
    "ppe-instruction": "safety_officer",
    "recovery-followup": "safety_officer",
    "safety-inspection": "safety_officer",
    "safety-briefing-new-employee": "safety_officer",
    "coordinate-ambulance": "safety_officer",
}

with open(PATH, encoding="utf-8") as f:
    topics = json.load(f)

missing = []
for t in topics:
    g = GROUP_OF.get(t["id"])
    if not g:
        missing.append(t["id"])
        continue
    t["group"] = g

if missing:
    raise SystemExit(f"No group assignment for: {missing}")

with open(PATH, "w", encoding="utf-8") as f:
    json.dump(topics, f, ensure_ascii=False, indent=2)
    f.write("\n")

from collections import Counter
counts = Counter(GROUP_OF.values())
print("Group assignment complete:")
for g, n in counts.items():
    print(f"  {g}: {n} topics")
