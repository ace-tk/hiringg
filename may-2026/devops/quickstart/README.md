# DevOps Internship Assignment — Tisha Kharade

# Distributed Inference System

This project demonstrates deployment of a containerized Flask API using Docker, Docker Hub, Terraform, and AWS EC2.

The objective of this assignment was to:
- Build and containerize an API
- Push Docker image to Docker Hub
- Provision infrastructure using Terraform
- Deploy and test the application on AWS EC2

---

# Architecture

User → Flask API → Docker Container → AWS EC2 Instance

Infrastructure provisioning was handled using Terraform.

---

# Tech Stack

- Python Flask
- Docker
- Docker Hub
- Terraform
- AWS EC2
- Ubuntu Linux
- AWS CLI

---

# Project Structure

```bash
quickstart/
│
├── workers/
│   └── inference-worker/
│       ├── app.py
│       ├── Dockerfile
│
├── terraform/
│   ├── main.tf
│
├── screenshots/
│
└── README.md
```

---

# Flask API

The Flask API exposes a simple inference endpoint.

## Endpoint

```bash
POST /infer
```

## Sample Request

```bash
curl -X POST http://localhost:3000/infer \
-H "Content-Type: application/json" \
-d '{"text":"OpenAI"}'
```

## Sample Response

```json
{
  "input": "OpenAI",
  "output": "Processed: OpenAI"
}
```

---

# Docker Setup

## Build Docker Image

```bash
docker build -t flask-api .
```

## Run Docker Container

```bash
docker run -d -p 3000:3000 flask-api
```

---

# Docker Hub

Docker image was successfully pushed to Docker Hub.

## Docker Image

```bash
tishaak/flask-api:v1
```

## Pull Image

```bash
docker pull tishaak/flask-api:v1
```

---

# Terraform Infrastructure

Terraform was used to provision AWS infrastructure.

## Resources Provisioned

- AWS EC2 Instance
- Security Groups
- Networking Configuration

## Terraform Commands

```bash
terraform init
terraform plan
terraform apply
```

---

# AWS Deployment

The Docker container was deployed on an Ubuntu EC2 instance.

The API was tested successfully using curl requests from the instance terminal.

---

# API Testing

## Local Test

```bash
curl -X POST http://localhost:3000/infer \
-H "Content-Type: application/json" \
-d '{"text":"docker works"}'
```

## EC2 Test

```bash
curl -X POST http://<EC2-PUBLIC-IP>:3000/infer \
-H "Content-Type: application/json" \
-d '{"text":"OpenAI"}'
```

---

# Screenshots

The following screenshots are included in the `/screenshots` folder:

- EC2 Instance
- Terraform Apply
- Docker Running Container
- Docker Hub Repository
- Successful API Response

---

# Challenges Faced

- Docker port conflicts
- AWS credential configuration for Terraform
- Security group and networking setup
- Docker daemon permission handling

These issues were debugged and resolved during deployment.

---

# Future Improvements

- Add CI/CD pipeline using GitHub Actions
- Deploy using ECS/Kubernetes
- Add HTTPS and Load Balancer
- Add monitoring and centralized logging
- Add automated testing pipeline

---

# Author
Tisha Kharade

# Distributed Inferencing Prototype

A prototype that runs a small language model behind a distributed worker mesh. A Python worker hosts the model and exposes inference as an RPC function; a TypeScript worker fans incoming HTTP requests into that RPC and returns the result as JSON. The two workers are written in different languages, can run on different machines, and are composed at runtime — so you can scale the inference tier independently of the API tier, swap implementations without downtime, and extend the mesh with additional workers as the system grows.

| Worker             | Language   | Function                       | Does                                                                                          |
| ------------------ | ---------- | ------------------------------ | --------------------------------------------------------------------------------------------- |
| `inference-worker` | Python     | `inference::run_inference`     | Loads `gemma-3-270m` (GGUF, Q8) via `transformers`, applies the chat template to `messages`, and returns the decoded model output. |
| `caller-worker`    | TypeScript | `inference::get_response`      | Calls `inference::run_inference` with the incoming `messages` payload and returns the result. |
| `caller-worker`    | TypeScript | `http::run_inference_over_http` | HTTP trigger bound to `POST /v1/chat/completions`; forwards the request body to `inference::get_response` and returns a JSON HTTP response. |

For more details regarding implementation, find docs here: https://iii.dev/docs/

# Distributed Inference System

## Architecture
- iii engine
- caller-worker
- inference-worker

## Setup

### Start caller worker
cd workers/caller-worker
npm install
npm run dev

### Start inference worker
cd workers/inference-worker
source venv/bin/activate
python inference_worker.py

## Test API

curl -s -X POST http://127.0.0.1:3000/v1/chat/completions \
-H "Content-Type: application/json" \
-d '{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}'