import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  const [orderProduct, setOrderProduct] = useState("");
  const [orderPrice, setOrderPrice] = useState("");

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  // Add or update user
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUserId) {
      // Update existing user
      fetch(`http://localhost:8080/api/users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
        .then(res => res.json())
        .then(() => {
          fetchUsers();
          setName("");
          setEmail("");
          setEditingUserId(null);
        })
        .catch(err => console.error(err));
    } else {
      // Create new user
      fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
        .then(res => res.json())
        .then(newUser => {
          setUsers([...users, newUser]);
          setName("");
          setEmail("");
        })
        .catch(err => console.error(err));
    }
  };

  // Delete user
  const deleteUser = (id) => {
    fetch(`http://localhost:8080/api/users/${id}`, {
      method: "DELETE"
    })
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  // Load user data into form for editing
  const editUser = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  // Add order for a user
  const addOrder = (userId) => {
    if (!orderProduct || !orderPrice) return;

    fetch(`http://localhost:8080/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName: orderProduct, price: parseFloat(orderPrice), userId })
    })
      .then(res => res.json())
      .then(() => {
        fetchUsers();
        setOrderProduct("");
        setOrderPrice("");
      })
      .catch(err => console.error(err));
  };

  const createOrder = (userId, product, price) => {
  fetch("http://localhost:8080/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productName: product, price }) // note userId
  })
    .then(res => res.json())
    .then(newOrder => {
      // Optionally, update the UI
      fetchUsers(); // refresh users with their orders
    })
    .catch(err => console.error(err));
};


  return (
    <div style={{ padding: "20px" }}>
      <h1>Users</h1>

      {/* User form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />
        <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => { setEditingUserId(null); setName(""); setEmail(""); }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* User list with orders */}
      {users.map(u => (
  <div key={u.id} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
    <span>{u.name} — {u.email}</span>

    {/* Existing buttons */}
    <button onClick={() => editUser(u)} style={{ marginLeft: "10px" }}>Edit</button>
    <button onClick={() => deleteUser(u.id)} style={{ marginLeft: "5px" }}>Delete</button>

    {/* Add order form */}
    <div style={{ marginTop: "10px" }}>
      <input type="text" placeholder="Product" id={`product-${u.id}`} />
      <input type="number" placeholder="Price" id={`price-${u.id}`} />
      <button onClick={() => {
        const product = document.getElementById(`product-${u.id}`).value;
        const price = document.getElementById(`price-${u.id}`).value;
        createOrder(u.id, product, price);
      }}>Add Order</button>
    </div>

    {/* Display orders if any */}
    {u.orders?.map(o => (
      <div key={o.id} style={{ marginLeft: "20px" }}>
        {o.productName} — ${o.price}
      </div>
    ))}
  </div>
))}


    </div>
  );
}

export default App;
