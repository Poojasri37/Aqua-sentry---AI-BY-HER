#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32 MH-ET Live READY 🚀");
}

void loop() {
  Serial.println("Running...");
  delay(2000);
}
