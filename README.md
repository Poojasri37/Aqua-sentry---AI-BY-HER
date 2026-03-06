# AquaSentry-Vision
AI & Edge Hardware System for Smart Water Tank Quality, Structural, and Hygiene Monitoring

AquaSentry-Vision is an AI-enabled water tank monitoring system designed to detect contamination risks, monitor water quality in real time, and provide predictive alerts before water becomes unsafe. The system integrates edge hardware sensors, artificial intelligence, and digital twin monitoring to transform conventional water tanks into intelligent water safety infrastructure.

**PROBLEM STATEMENT**

Most water contamination occurs after purification during storage in tanks located in schools, hospitals, apartments, hostels, community water systems, and municipal storage facilities. Common issues include water stagnation, biofilm formation, particulate accumulation, microplastic contamination, chemical imbalance, and lack of continuous monitoring. Traditional monitoring methods rely on manual inspection, periodic laboratory testing, and basic sensor measurements. These approaches cannot detect contamination early or provide predictive alerts.

SOLUTION

AquaSentry-Vision converts each water tank into an AI-powered monitoring node that continuously analyzes water quality and infrastructure health. The system enables real-time water quality monitoring, predictive contamination alerts 24–72 hours before risk, microplastic detection using optical and AI methods, digital twin tank visualization, natural purification recommendations, carcinogenic risk estimation, and district-level monitoring dashboards.

SYSTEM ARCHITECTURE

The platform integrates sensor hardware, edge computing, AI analytics, and cloud-based dashboards.

Data Flow:
Sensors → ESP32 Edge Controller → AI Processing → Cloud Backend → Dashboard → Maintenance Alerts

**HARDWARE COMPONENTS**

ESP32 edge controller  
GSM communication module  
DS18B20 temperature sensor  
pH sensor with interface board  
Turbidity sensor  
EC/TDS conductivity sensor  
ORP sensor for oxidation-reduction potential monitoring  
Polarized LED and photodiode optical scattering chamber for microplastic detection  
ADS1115 high-resolution ADC for precise optical sensor readings  
JSN-SR04T ultrasonic water level sensor  
Waterproof camera module for particle detection  
Li-ion battery pack with TP4056 charging module  
6V solar panel for off-grid operation  
IP65 waterproof electronics enclosure  
PVC sensor probe housing with weighted probe chamber  
Modular natural purification unit with biosand filtration, activated carbon filtration, mineral filtration media, and ceramic microfiltration cartridges

**SOFTWARE STACK**

Python backend  
FastAPI framework  
TensorFlow Lite for edge AI inference  
YOLO object detection for microplastic detection  
Sensor fusion algorithms  
Carcinogenic Risk Index computation module  
Natural purification control logic  
MQTT and HTTPS communication protocols  
WebSocket real-time data streaming  
SQLite or JSON data storage  
Chart.js dashboard visualization  
Leaflet geolocation mapping  
Node-RED automation workflows  
PlatformIO firmware build system  
Arduino IDE for ESP32 programming

**KEY FEATURES**

Real-Time Monitoring  
Continuous monitoring of water parameters including pH, turbidity, temperature, EC/TDS, ORP, and water level.

Microplastic Detection  
A hybrid detection system using optical scattering sensors and AI-based computer vision models to identify microplastic contamination signals.

Predictive Contamination Alerts  
Machine learning models analyze sensor trends to detect contamination patterns such as stagnation, chemical imbalance, and particulate buildup. Alerts can be generated 24–72 hours before water becomes unsafe.

Natural Purification Guidance  
When contamination is detected, the system recommends safe purification methods including activated carbon filtration, mineral filtration using limestone or zeolite, biosand filtration, ceramic microfiltration, moringa seed coagulation, and solar-based microbial suppression.

Carcinogenic Risk Index  
The system estimates potential long-term health risk by correlating ORP changes, EC/TDS anomalies, turbidity variations, and optical particle signatures. The output is a risk score from 0 to 100 indicating contamination severity.

DASHBOARD

The monitoring dashboard provides real-time water quality graphs, hygiene score visualization, contamination alerts, purification recommendations, tank geolocation monitoring, and maintenance scheduling.

BUSINESS MODEL

AquaSentry-Vision operates using a Monitoring-as-a-Service model. Revenue streams include hardware installation, institutional monitoring subscriptions, maintenance services, water safety analytics for municipalities, and compliance or certification services.

Target users include schools, hospitals, apartment complexes, municipal water infrastructure, panchayat water tanks, and industrial water storage facilities.

IMPACT

AquaSentry-Vision aims to reduce contamination exposure, improve public health safety, enable predictive water infrastructure maintenance, reduce monitoring costs, and support the development of intelligent water safety networks.

FUTURE SCOPE

Future enhancements include advanced microplastic quantification sensors, structural tank health monitoring, AI-driven predictive cleaning cycles, district-level water hygiene indexing, integration with public health monitoring platforms, and scalable nationwide water safety infrastructure systems.

LICENSE

This project is intended for research, innovation, and development of smart water infrastructure solutions.
Built by 
Poojasri M
poojasrinirmalamanickam@gmail.com
