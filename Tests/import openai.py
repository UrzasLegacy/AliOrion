import openai
import os
import socket

openai.api_key = os.environ["OPENAI_API_KEY"] # Replace with your OpenAI API key

def chat(prompt):
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        max_tokens=1024,
        n=1,
        stop=None,
        temperature=0.5,
    )

    message = response.choices[0].text.strip()
    return message

UDP_IP = "127.0.0.1" # Replace with your desired IP address
UDP_PORT = 5005 # Replace with your desired port number

sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
sock.bind((UDP_IP, UDP_PORT))

print(f"Listening on {UDP_IP}:{UDP_PORT}")

while True:
    data, addr = sock.recvfrom(1024)
    prompt = data.decode("utf-8")
    if prompt.lower() == "exit":
        break
    response = chat(prompt)
    sock.sendto(response.encode("utf-8"), addr)