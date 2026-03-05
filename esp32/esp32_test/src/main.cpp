#include <Arduino.h>
#include <math.h>

// ---------------- PIN DEFINITIONS ----------------
#define PH_PIN         34   // pH analog input
#define TURB_PIN       35   // Turbidity analog input

// ---------------- pH CALIBRATION ----------------
#define PH_NEUTRAL_VOLTAGE 1.65   // your measured voltage at pH 7
#define PH_SLOPE           0.18   // sensor slope

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("ESP32 Water Quality Logger Started");
}

void loop() {

  // ----------- pH SENSOR -----------
  int ph_adc = analogRead(PH_PIN);
  float ph_voltage = ph_adc * (3.3 / 4095.0);
  float pH = 7 + (PH_NEUTRAL_VOLTAGE - ph_voltage) / PH_SLOPE;

  // ----------- TURBIDITY SENSOR -----------
  int turb_adc = analogRead(TURB_PIN);
  float turb_voltage = turb_adc * (3.3 / 4095.0);

  // NTU calculation (standard approximation)
  float turbidity =
      -1120.4 * pow(turb_voltage, 2) +
       5742.3 * turb_voltage -
       4352.9;

  if (turbidity < 0) turbidity = 0;   // safety clamp

  // ----------- JSON OUTPUT -----------
  Serial.print("{");
  Serial.print("\"pH\":"); Serial.print(pH, 2); Serial.print(",");
  Serial.print("\"ph_voltage\":"); Serial.print(ph_voltage, 3); Serial.print(",");
  Serial.print("\"turbidity_voltage\":"); Serial.print(turb_voltage, 3); Serial.print(",");
  Serial.print("\"turbidity\":"); Serial.print(turbidity, 1);
  Serial.println("}");

  delay(2000);
}
