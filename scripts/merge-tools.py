#!/usr/bin/env python3
"""Merge all tools-*.json files into tools-raw.json, deduplicating by id."""
import json
import glob
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "src", "data")
output_file = os.path.join(data_dir, "tools-raw.json")

# Load existing tools
with open(output_file) as f:
    all_tools = json.load(f)

seen_ids = {t["id"] for t in all_tools}
print(f"Existing tools: {len(all_tools)}")

# Load all batch files
batch_files = sorted(glob.glob(os.path.join(data_dir, "tools-batch-*.json")))
for batch_file in batch_files:
    with open(batch_file) as f:
        batch = json.load(f)

    added = 0
    for tool in batch:
        if tool["id"] not in seen_ids:
            all_tools.append(tool)
            seen_ids.add(tool["id"])
            added += 1

    print(f"  {os.path.basename(batch_file)}: {len(batch)} tools, {added} new")

print(f"Total tools after merge: {len(all_tools)}")

# Validate
for tool in all_tools:
    required = ["id", "name", "url", "category", "description", "pricing", "targetUser", "keyFeature"]
    missing = [k for k in required if k not in tool]
    if missing:
        print(f"  WARNING: {tool.get('id', '???')} missing: {missing}")

# Write merged output
with open(output_file, "w") as f:
    json.dump(all_tools, f, indent=2, ensure_ascii=False)

print(f"Written to {output_file}")
