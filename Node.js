const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let users = [];
if (fs.existsSync('users.json')) users = JSON.parse(fs.readFileSync('users.json'));

// تسجيل مستخدم جديد
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) return res.json({ success:false, msg:'المستخدم موجود' });
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash, balance:1000, transactions:[] });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.json({ success:true });
});

// تسجيل الدخول
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u=>u.username===username);
  if(!user) return res.json({success:false,msg:'المستخدم غير موجود'});
  const match = await bcrypt.compare(password,user.password);
  if(!match) return res.json({success:false,msg:'كلمة المرور خطأ'});
  res.json({success:true, user:{username:user.username,balance:user.balance,transactions:user.transactions}});
});

// إرسال عملة داخل الموقع
app.post('/send', (req,res)=>{
  const { from, to, amount } = req.body;
  const sender = users.find(u=>u.username===from);
  const receiver = users.find(u=>u.username===to);
  if(!sender || !receiver) return res.json({success:false,msg:'المستخدم غير موجود'});
  if(sender.balance < amount) return res.json({success:false,msg:'الرصيد غير كافي'});

  sender.balance -= amount;
  receiver.balance += amount;

  sender.transactions.push(`أرسلت ${amount} DRAGON COIN إلى ${to}`);
  receiver.transactions.push(`استلمت ${amount} DRAGON COIN من ${from}`);

  fs.writeFileSync('users.json', JSON.stringify(users,null,2));
  res.json({success:true});
});

app.listen(3000,()=>console.log('Server running on http://localhost:3000'));