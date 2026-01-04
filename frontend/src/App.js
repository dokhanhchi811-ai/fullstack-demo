import { useEffect, useState } from "react";
import "./App.css"; // import the new CSS

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);

  const [orderProduct, setOrderProduct] = useState("");
  const [orderPrice, setOrderPrice] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUserId) {
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

  const deleteUser = (id) => {
    fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" })
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  const editUser = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const createOrder = (userId, product, price) => {
    fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productName: product, price })
    })
      .then(res => res.json())
      .then(() => fetchUsers())
      .catch(err => console.error(err));
  };

  return (
    <div className="container">
      <h1>Users</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">{editingUserId ? "Update User" : "Add User"}</button>
        {editingUserId && (
          <button
            type="button"
            onClick={() => { setEditingUserId(null); setName(""); setEmail(""); }}
          >
            Cancel
          </button>
        )}
      </form>

      {users.map(u => (
        <div key={u.id} className="user-card">
          <div className="user-header">
            <span>{u.name} — {u.email}</span>
            <div>
              <button onClick={() => editUser(u)}>Edit</button>
              <button onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          </div>

          <div className="add-order-form">
            <input type="text" placeholder="Product" id={`product-${u.id}`} />
            <input type="number" placeholder="Price" id={`price-${u.id}`} />
            <button onClick={() => {
              const product = document.getElementById(`product-${u.id}`).value;
              const price = document.getElementById(`price-${u.id}`).value;
              createOrder(u.id, product, price);
            }}>Add Order</button>
          </div>

          <div className="order-list">
            {u.orders?.map(o => (
              <div key={o.id} className="order-item">
                {o.productName} — ${o.price}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
