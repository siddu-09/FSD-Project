# Use Case Diagram

```mermaid
usecaseDiagram
    actor "Customer" as User
    actor "Administrator" as Admin

    package "BookStore Application" {
        
        usecase "Register/Login" as Auth
        usecase "Browse Books" as Browse
        usecase "Search Books (Author/Genre)" as Search
        usecase "View Book Details" as View
        usecase "Add to Cart" as Cart
        usecase "Checkout/Place Order" as Order
        usecase "View Order History" as History
        
        usecase "Manage Inventory (CRUD)" as ManageBooks
        usecase "View All Orders" as ViewAllOrders
        usecase "Update Order Status" as UpdateStatus
        usecase "Upload Book Covers" as Upload
    }

    User --> Auth
    User --> Browse
    User --> Search
    User --> View
    User --> Cart
    User --> Order
    User --> History

    Admin --> Auth
    Admin --> ManageBooks
    Admin --> ViewAllOrders
    Admin --> UpdateStatus
    Admin --> Upload
```
