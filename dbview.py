import sqlite3

conn = sqlite3.connect("expenses.db")
c = conn.cursor()

# List tables
c.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = c.fetchall()
print("Tables:", tables)

# Show all expenses
c.execute("SELECT * FROM expenses;")
rows = c.fetchall()
print("Expenses table data:")
for row in rows:
    print(row)

# Show all users
c.execute("SELECT * FROM users;")
rows = c.fetchall()
print("Users table data:")
for row in rows:
    print(row)
import sqlite3

conn = sqlite3.connect("expenses.db")
c = conn.cursor()

# Show all users
c.execute("SELECT * FROM users;")
rows = c.fetchall()

print("Users:")
for row in rows:
    print(row)   # (id, username, password)

conn.close()
