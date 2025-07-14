# Full-Stack App

This is a full-stack application with `frontend` and `backend` folders.

## 🛠 How to Start the App

```bash
# 1 add .env file in /backend and /frontend

# 2. Make sure Docker is running
start database => docker compose up

# 3. Start the backend
cd ./backend
yarn install
yarn dev
![alt text](start-backend)

#4. Start webhook stripe
cd ./backend 
yarn start-stripe
![alt text](start-stripe.png)

# 4. In a new terminal, start the frontend
cd ./frontend
yarn install
yarn dev
![alt text](start-frontend.png)

The frontend will be available at: http://localhost:3000
The backend API will be available at: http://localhost:5000

login admin@ayasan.jp
pass admin123
```
# Full-Stack App For test stripe and send mail using collection

# Test Email Feature
Notice: Make sure that you started backend </br>
**Step 1**: import [postman collection](asyan.postman_collection.json) </br>
**Step 2**: change email into your email 
![alt text](email-1.png)
**Step 3**: Click send button </br>
![alt text](email-2.png)
**Step 4**: Check your email, it should have email like below picture </br>
![alt text](email-3.png)

# Test Stripe Payment 
Notice: You startd backend and webhook stripe </br>
**Step 1**: import [postman collection](asyan.postman_collection.json) </br>
**Step 2**: change email and your name in request </br>
![alt text](stripe-1.png)
**Step 3**: Click Send Button </br>
![alt text](stripe-2.png)
**Step 4**: Open new browser tab with value of url </br>
![alt text](stripe-3.png)
**Step 5**: type your payment info </br>
![alt text](stripe-4.png) 
**Step 6**: Check result </br>
- browser show success page </br>
![alt text](stripe-5.png)
- Receive email </br>
![alt text](stripe-6.png)
- Have new record for booking </br>
![alt text](stripe-7.png)

