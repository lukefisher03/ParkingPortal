#!/bin/bash

echo "TEST STARTED"
cd ../api/
mv master.db _master.db
python3 construct_db.py

cd ../tests/
python3 test_api.py

cd ../api/
rm master.db
mv _master.db master.db
