import os
import csv
import time
import requests
from threading import Thread
from flask import Flask, jsonify, render_template, request
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

app = Flask(__name__)

# Global variables to store the latest data
latest_data = {"number": "No Data", "timestamp": time.time()}
latest_api_data = {"numberAPI": "No Data", "timestamp": time.time()}

class CSVHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith('.csv'):
            self.process_csv(event.src_path)

    def process_csv(self, filepath):
        try:
            with open(filepath, 'r') as file:
                reader = csv.reader(file)
                data = list(reader)
                number = data[0][0] if data else "No Data"

            global latest_data
            latest_data = {"number": number, "timestamp": time.time()}
            
            app.logger.info(f"Updated data: {latest_data}")

            os.remove(filepath)
            app.logger.info(f"Deleted CSV file: {filepath}")
        except Exception as e:
            app.logger.error(f"Error processing CSV: {str(e)}")

def fetch_api_data():
    while True:
        try:
            response = requests.post('http://localhost:8000/numberAPI', json={})
            if response.status_code == 200:
                data = response.json()
                numberAPI = data.get('numberAPI', "No Data")

                global latest_api_data
                latest_api_data = {"numberAPI": numberAPI, "timestamp": time.time()}
                
                app.logger.info(f"Updated API data: {latest_api_data}")
            else:
                app.logger.error(f"Failed to fetch API data: {response.status_code}")
                
                           
            time.sleep(5)
        except Exception as e:
            app.logger.error(f"Error fetching API data: {str(e)}")
            time.sleep(5)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data.json')
def get_data():
    return jsonify(latest_data)

@app.route('/api_data.json')
def get_api_data():
    return jsonify(latest_api_data)

@app.route('/numberAPI', methods=['POST'])
def update_number_api():
    data = request.json
    app.logger.info(f'Received data: {data}')
    
    if not data or 'numberAPI' not in data:
        app.logger.error('Invalid data received or missing numberAPI')
        return jsonify({"error": "Invalid data"}), 400
    
    numberAPI = data.get('numberAPI')
    global latest_api_data
    latest_api_data = {"numberAPI": numberAPI, "timestamp": time.time()}
    app.logger.info(f'Updated API data: {latest_api_data}')
    return jsonify(latest_api_data)

def start_file_watcher():
    event_handler = CSVHandler()
    observer = Observer()
    observer.schedule(event_handler, path='/app', recursive=False)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    # Start the file watcher and API data fetching in separate threads
    watcher_thread = Thread(target=start_file_watcher)
    api_thread = Thread(target=fetch_api_data)
    watcher_thread.start()
    api_thread.start()

    # Start the Flask app
    app.run(host='0.0.0.0', port=8000, debug=True, use_reloader=False)
