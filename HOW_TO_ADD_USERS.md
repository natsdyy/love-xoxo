## **How to Add Users to the System**

You can now add users directly through the **Users & Activity** page in the Owner panel.

### **Step 1: Login to the Owner Account**
- Go to: `http://localhost:5173/login`
- **Username:** `ownereli`
- **Password:** `silverdawn`

### **Step 2: Navigate to Users & Activity**
- From the Owner sidebar, click **"Users"** (Users & Activity)
- Click the **"+ Add User"** button (top right)

### **Step 3: Fill in User Details**

**For Admin Users:**
```
Username:     admin_cherry
Display Name: Cherry
Role:         Admin
```

```
Username:     admin_mir
Display Name: Mir
Role:         Admin
```

```
Username:     admin_sica
Display Name: Sica
Role:         Admin
```

**For Owner User (optional):**
```
Username:     ownereli
Display Name: Eli
Role:         Owner
```

### **Step 4: Click "Add User"**
Each user will be created and stored in Firestore immediately.

### **Step 5: View Users**
- The Users table will update and show all added users
- Stats cards show: Total Users, Total Admins, Active Users
- Filter by "Admins Only" to see only admin accounts

## **Firestore Location**
All users are stored in: **Firestore → Database → users collection**

Each user document contains:
- `username` - Login username
- `displayName` - Display name (Cherry, Mir, etc.)
- `role` - admin or owner
- `lastLoginFormatted` - Last login timestamp
- `isActive` - Active status
- `device` - Device information

## **Login After Adding**
Once users are added, they can login with:
- Username (e.g., `admin_cherry`)
- Password: `xzshop123` (admins) or `silverdawn` (owner)

---

**Note:** The "Add User" feature allows you to pre-populate the system with users before they actually log in. Once they log in, their last login time will update automatically.
