bool outputStatus[12] = {false};

const int MAIN_VALVE = D0;
const int VALVE1     = D1;
const int VALVE2     = D2;
const int VALVE3     = D3;

const int VALVE4     = D4;
const int VALVE5     = D5;
const int FIX_POWER  = D6;
const int SPARE1     = D7;

const int SPARE2     = D8;
const int SPARE3     = D9;
const int SPARE4     = D10;
const int SPARE5     = D11;

char inputBuffer[64];
uint8_t bufferIndex = 0;

void setup()
{
    Serial.begin(115200);

    delay(2000); // Allow USB CDC to initialize

    pinMode(MAIN_VALVE, OUTPUT);
    pinMode(VALVE1, OUTPUT);
    pinMode(VALVE2, OUTPUT);
    pinMode(VALVE3, OUTPUT);

    pinMode(VALVE4, OUTPUT);
    pinMode(VALVE5, OUTPUT);
    pinMode(FIX_POWER, OUTPUT);
    pinMode(SPARE1, OUTPUT);

    pinMode(SPARE2, OUTPUT);
    pinMode(SPARE3, OUTPUT);
    pinMode(SPARE4, OUTPUT);
    pinMode(SPARE5, OUTPUT);

    resetOutputs();

    sendResponse("OPTA READY");
}

void loop()
{
    while (Serial.available() > 0)
    {
        char inChar = Serial.read();

        if (inChar == '\r' || inChar == '\n')
        {
            if (bufferIndex > 0)
            {
                inputBuffer[bufferIndex] = '\0';

                String cmd = String(inputBuffer);

                bufferIndex = 0;
                memset(inputBuffer, 0, sizeof(inputBuffer));

                processCommand(cmd);
            }
        }
        else
        {
            if (bufferIndex < sizeof(inputBuffer) - 1)
            {
                inputBuffer[bufferIndex++] = inChar;
            }
            else
            {
                bufferIndex = 0;
                memset(inputBuffer, 0, sizeof(inputBuffer));
                sendResponse("ERROR: BUFFER OVERFLOW");
            }
        }
    }
}

void sendResponse(String msg)
{
    Serial.println(msg);
}

void processCommand(String cmd)
{
    cmd.trim();
    cmd.toUpperCase();

    if (cmd == "MAIN_VALVE ON" || cmd == "1")
    {
        digitalWrite(MAIN_VALVE, HIGH);
        outputStatus[0] = true;
        sendResponse("MAIN_VALVE ON");
    }
    else if (cmd == "MAIN_VALVE OFF" || cmd == "0")
    {
        digitalWrite(MAIN_VALVE, LOW);
        outputStatus[0] = false;
        sendResponse("MAIN_VALVE OFF");
    }

    else if (cmd == "VALVE1 ON" || cmd == "2")
    {
        digitalWrite(VALVE1, HIGH);
        outputStatus[1] = true;
        sendResponse("VALVE1 ON");
    }
    else if (cmd == "VALVE1 OFF" || cmd == "3")
    {
        digitalWrite(VALVE1, LOW);
        outputStatus[1] = false;
        sendResponse("VALVE1 OFF");
    }

    else if (cmd == "VALVE2 ON" || cmd == "4")
    {
        digitalWrite(VALVE2, HIGH);
        outputStatus[2] = true;
        sendResponse("VALVE2 ON");
    }
    else if (cmd == "VALVE2 OFF" || cmd == "5")
    {
        digitalWrite(VALVE2, LOW);
        outputStatus[2] = false;
        sendResponse("VALVE2 OFF");
    }

    else if (cmd == "VALVE3 ON" || cmd == "6")
    {
        digitalWrite(VALVE3, HIGH);
        outputStatus[3] = true;
        sendResponse("VALVE3 ON");
    }
    else if (cmd == "VALVE3 OFF" || cmd == "7")
    {
        digitalWrite(VALVE3, LOW);
        outputStatus[3] = false;
        sendResponse("VALVE3 OFF");
    }

    else if (cmd == "VALVE4 ON" || cmd == "8")
    {
        digitalWrite(VALVE4, HIGH);
        outputStatus[4] = true;
        sendResponse("VALVE4 ON");
    }
    else if (cmd == "VALVE4 OFF" || cmd == "9")
    {
        digitalWrite(VALVE4, LOW);
        outputStatus[4] = false;
        sendResponse("VALVE4 OFF");
    }

    else if (cmd == "VALVE5 ON" || cmd == "A")
    {
        digitalWrite(VALVE5, HIGH);
        outputStatus[5] = true;
        sendResponse("VALVE5 ON");
    }
    else if (cmd == "VALVE5 OFF" || cmd == "B")
    {
        digitalWrite(VALVE5, LOW);
        outputStatus[5] = false;
        sendResponse("VALVE5 OFF");
    }

    else if (cmd == "FIX_POWER ON" || cmd == "C")
    {
        digitalWrite(FIX_POWER, HIGH);
        outputStatus[6] = true;
        sendResponse("FIX_POWER ON");
    }
    else if (cmd == "FIX_POWER OFF" || cmd == "D")
    {
        digitalWrite(FIX_POWER, LOW);
        outputStatus[6] = false;
        sendResponse("FIX_POWER OFF");
    }

    else if (cmd == "SPARE1 ON" || cmd == "E")
    {
        digitalWrite(SPARE1, HIGH);
        outputStatus[7] = true;
        sendResponse("SPARE1 ON");
    }
    else if (cmd == "SPARE1 OFF" || cmd == "F")
    {
        digitalWrite(SPARE1, LOW);
        outputStatus[7] = false;
        sendResponse("SPARE1 OFF");
    }

    else if (cmd == "SPARE2 ON" || cmd == "G")
    {
        digitalWrite(SPARE2, HIGH);
        outputStatus[8] = true;
        sendResponse("SPARE2 ON");
    }
    else if (cmd == "SPARE2 OFF" || cmd == "H")
    {
        digitalWrite(SPARE2, LOW);
        outputStatus[8] = false;
        sendResponse("SPARE2 OFF");
    }

    else if (cmd == "SPARE3 ON" || cmd == "I")
    {
        digitalWrite(SPARE3, HIGH);
        outputStatus[9] = true;
        sendResponse("SPARE3 ON");
    }
    else if (cmd == "SPARE3 OFF" || cmd == "J")
    {
        digitalWrite(SPARE3, LOW);
        outputStatus[9] = false;
        sendResponse("SPARE3 OFF");
    }

    else if (cmd == "SPARE4 ON" || cmd == "K")
    {
        digitalWrite(SPARE4, HIGH);
        outputStatus[10] = true;
        sendResponse("SPARE4 ON");
    }
    else if (cmd == "SPARE4 OFF" || cmd == "L")
    {
        digitalWrite(SPARE4, LOW);
        outputStatus[10] = false;
        sendResponse("SPARE4 OFF");
    }

    else if (cmd == "SPARE5 ON" || cmd == "M")
    {
        digitalWrite(SPARE5, HIGH);
        outputStatus[11] = true;
        sendResponse("SPARE5 ON");
    }
    else if (cmd == "SPARE5 OFF" || cmd == "N")
    {
        digitalWrite(SPARE5, LOW);
        outputStatus[11] = false;
        sendResponse("SPARE5 OFF");
    }

    else if (cmd == "QUERY STATUS" || cmd == "Q")
    {
        sendStatus();
    }

    else if (cmd == "RESET" || cmd == "Z")
    {
        resetOutputs();
        sendResponse("ALL OUTPUTS RESET");
    }

    else
    {
        sendResponse("ERROR: INVALID COMMAND");
    }
}

void sendStatus()
{
    sendResponse("===== STATUS =====");
    sendResponse(String("MAIN_VALVE : ") + (outputStatus[0] ? "ON" : "OFF"));
    sendResponse(String("VALVE1 : ") + (outputStatus[1] ? "ON" : "OFF"));
    sendResponse(String("VALVE2 : ") + (outputStatus[2] ? "ON" : "OFF"));
    sendResponse(String("VALVE3 : ") + (outputStatus[3] ? "ON" : "OFF"));
    sendResponse(String("VALVE4 : ") + (outputStatus[4] ? "ON" : "OFF"));
    sendResponse(String("VALVE5 : ") + (outputStatus[5] ? "ON" : "OFF"));
    sendResponse(String("FIX_POWER : ") + (outputStatus[6] ? "ON" : "OFF"));
    sendResponse(String("SPARE1 : ") + (outputStatus[7] ? "ON" : "OFF"));
    sendResponse(String("SPARE2 : ") + (outputStatus[8] ? "ON" : "OFF"));
    sendResponse(String("SPARE3 : ") + (outputStatus[9] ? "ON" : "OFF"));
    sendResponse(String("SPARE4 : ") + (outputStatus[10] ? "ON" : "OFF"));
    sendResponse(String("SPARE5 : ") + (outputStatus[11] ? "ON" : "OFF"));
    sendResponse("==================");
}

void resetOutputs()
{
    digitalWrite(MAIN_VALVE, LOW);
    digitalWrite(VALVE1, LOW);
    digitalWrite(VALVE2, LOW);
    digitalWrite(VALVE3, LOW);

    digitalWrite(VALVE4, LOW);
    digitalWrite(VALVE5, LOW);
    digitalWrite(FIX_POWER, LOW);
    digitalWrite(SPARE1, LOW);

    digitalWrite(SPARE2, LOW);
    digitalWrite(SPARE3, LOW);
    digitalWrite(SPARE4, LOW);
    digitalWrite(SPARE5, LOW);

    for (int i = 0; i < 12; i++)
    {
        outputStatus[i] = false;
    }
}