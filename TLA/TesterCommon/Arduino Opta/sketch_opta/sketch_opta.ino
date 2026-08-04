#include "OptaBlue.h"

using namespace Opta;

bool outputStatus[12] = {false};

void printStatus();
void resetAllOutputs(DigitalMechExpansion &mechExp);

void setup()
{
    Serial.begin(115200);
    while (!Serial)
    {
       ; 
    }

    OptaController.begin();

    pinMode(LED_D0, OUTPUT);
    pinMode(LED_D1, OUTPUT);
    pinMode(LED_D2, OUTPUT);
    pinMode(LED_D3, OUTPUT);

    pinMode(D0, OUTPUT);
    pinMode(D1, OUTPUT);
    pinMode(D2, OUTPUT);
    pinMode(D3, OUTPUT);

    Serial.println("CONNECTED");
    Serial.println("OPTA READY");
    
}

void loop()
{
    OptaController.update();

    if (Serial.available())
    {
        String cmd = Serial.readStringUntil('\n');
        cmd.trim();
        cmd.toUpperCase();

        DigitalMechExpansion mechExp =
            OptaController.getExpansion(0);

        if (cmd == "MAIN_VALVE ON")
        {
            digitalWrite(LED_D0, HIGH);
            digitalWrite(D0, HIGH);
            outputStatus[0] = true;
            Serial.println("SUCCESS: MAIN_VALVE ON");
        }
        else if (cmd == "MAIN_VALVE OFF")
        {
            digitalWrite(LED_D0, LOW);
            digitalWrite(D0, LOW);
            outputStatus[0] = false;
            Serial.println("SUCCESS: MAIN_VALVE OFF");
        }

        else if (cmd == "VALVE1 ON")
        {
            digitalWrite(LED_D1, HIGH);
            digitalWrite(D1, HIGH);
            outputStatus[1] = true;
            Serial.println("SUCCESS: VALVE1 ON");
        }
        else if (cmd == "VALVE1 OFF")
        {
            digitalWrite(LED_D1, LOW);
            digitalWrite(D1, LOW);
            outputStatus[1] = false;
            Serial.println("SUCCESS: VALVE1 OFF");
        }

        else if (cmd == "VALVE2 ON")
        {
            digitalWrite(LED_D2, HIGH);
            digitalWrite(D2, HIGH);
            outputStatus[2] = true;
            Serial.println("SUCCESS: VALVE2 ON");
        }
        else if (cmd == "VALVE2 OFF")
        {
            digitalWrite(LED_D2, LOW);
            digitalWrite(D2, LOW);
            outputStatus[2] = false;
            Serial.println("SUCCESS: VALVE2 OFF");
        }

        else if (cmd == "VALVE3 ON")
        {
            digitalWrite(LED_D3, HIGH);
            digitalWrite(D3, HIGH);
            outputStatus[3] = true;
            Serial.println("SUCCESS: VALVE3 ON");
        }
        else if (cmd == "VALVE3 OFF")
        {
            digitalWrite(LED_D3, LOW);
            digitalWrite(D3, LOW);
            outputStatus[3] = false;
            Serial.println("SUCCESS: VALVE3 OFF");
        }

        else if (cmd == "VALVE4 ON")
        {
            mechExp.digitalWrite(0, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[4] = true;
            Serial.println("SUCCESS: VALVE4 ON");
        }
        else if (cmd == "VALVE4 OFF")
        {
            mechExp.digitalWrite(0, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[4] = false;
            Serial.println("SUCCESS: VALVE4 OFF");
        }

        else if (cmd == "VALVE5 ON")
        {
            mechExp.digitalWrite(1, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[5] = true;
            Serial.println("SUCCESS: VALVE5 ON");
        }
        else if (cmd == "VALVE5 OFF")
        {
            mechExp.digitalWrite(1, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[5] = false;
            Serial.println("SUCCESS: VALVE5 OFF");
        }

        else if (cmd == "FIX_POWER ON")
        {
            mechExp.digitalWrite(2, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[6] = true;
            Serial.println("SUCCESS: FIX_POWER ON");
        }
        else if (cmd == "FIX_POWER OFF")
        {
            mechExp.digitalWrite(2, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[6] = false;
            Serial.println("SUCCESS: FIX_POWER OFF");
        }

        else if (cmd == "SPARE1 ON")
        {
            mechExp.digitalWrite(3, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[7] = true;
            Serial.println("SUCCESS: SPARE1 ON");
        }
        else if (cmd == "SPARE1 OFF")
        {
            mechExp.digitalWrite(3, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[7] = false;
            Serial.println("SUCCESS: SPARE1 OFF");
        }

        else if (cmd == "SPARE2 ON")
        {
            mechExp.digitalWrite(4, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[8] = true;
            Serial.println("SUCCESS: SPARE2 ON");
        }
        else if (cmd == "SPARE2 OFF")
        {
            mechExp.digitalWrite(4, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[8] = false;
            Serial.println("SUCCESS: SPARE2 OFF");
        }

        else if (cmd == "SPARE3 ON")
        {
            mechExp.digitalWrite(5, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[9] = true;
            Serial.println("SUCCESS: SPARE3 ON");
        }
        else if (cmd == "SPARE3 OFF")
        {
            mechExp.digitalWrite(5, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[9] = false;
            Serial.println("SUCCESS: SPARE3 OFF");
        }

        else if (cmd == "SPARE4 ON")
        {
            mechExp.digitalWrite(6, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[10] = true;
            Serial.println("SUCCESS: SPARE4 ON");
        }
        else if (cmd == "SPARE4 OFF")
        {
            mechExp.digitalWrite(6, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[10] = false;
            Serial.println("SUCCESS: SPARE4 OFF");
        }

        else if (cmd == "SPARE5 ON")
        {
            mechExp.digitalWrite(7, HIGH);
            mechExp.updateDigitalOutputs();
            outputStatus[11] = true;
            Serial.println("SUCCESS: SPARE5 ON");
        }
        else if (cmd == "SPARE5 OFF")
        {
            mechExp.digitalWrite(7, LOW);
            mechExp.updateDigitalOutputs();
            outputStatus[11] = false;
            Serial.println("SUCCESS: SPARE5 OFF");
        }

        else if (cmd == "QUERY STATUS")
        {
            printStatus();
        }

        else if (cmd == "RESET")
        {
            resetAllOutputs(mechExp);
            Serial.println("ALL OUTPUTS RESET");
        }
        
        else if (cmd == "EXIT")
        {
            resetAllOutputs(mechExp);
            Serial.println("ALL OUTPUTS RESET");
            Serial.println("DISCONNECTED");
        }

        else
        {
            Serial.println("ERROR: INVALID COMMAND");
        }
    }
}

void printStatus()
{
    const char *names[12] =
    {
        "MAIN_VALVE",
        "VALVE1",
        "VALVE2",
        "VALVE3",
        "VALVE4",
        "VALVE5",
        "FIX_POWER",
        "SPARE1",
        "SPARE2",
        "SPARE3",
        "SPARE4",
        "SPARE5"
    };

    Serial.println("===== STATUS =====");

    for (int i = 0; i < 12; i++)
    {
        Serial.print(names[i]);
        Serial.print(" : ");
        Serial.println(outputStatus[i] ? "ON" : "OFF");
    }

    Serial.println("==================");
}

void resetAllOutputs(DigitalMechExpansion &mechExp)
{
    digitalWrite(LED_D0, LOW);
    digitalWrite(LED_D1, LOW);
    digitalWrite(LED_D2, LOW);
    digitalWrite(LED_D3, LOW);

    digitalWrite(D0, LOW);
    digitalWrite(D1, LOW);
    digitalWrite(D2, LOW);
    digitalWrite(D3, LOW);

    for (int i = 0; i < 8; i++)
    {
        mechExp.digitalWrite(i, LOW);
    }

    mechExp.updateDigitalOutputs();

    for (int i = 0; i < 12; i++)
    {
        outputStatus[i] = false;
    }
}
