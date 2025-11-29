import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthController } from "../controllers/auth.controller";
import { CategoriesController } from "../controllers/categories.controller";
import { UserController } from "../controllers/user.controller";
import { PaymentLogsController } from "../controllers/payment-logs.controller";
import { TransactionController } from "../controllers/transaction.controller";
import { TransactionItemsController } from "../controllers/transaction-items.controller";
import { AuditLogsController } from "../controllers/audit-logs.controller";

const router = Router();

const authController = new AuthController();
const userController = new UserController();
const categoriesController = new CategoriesController();
const productController = new ProductController();
const paymentLogsController = new PaymentLogsController();
const transactionController = new TransactionController();
const transactionItemsController = new TransactionItemsController();
const auditLogsController = new AuditLogsController();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);
router.post("/auth/change-password", authController.changePassword);

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.softDeleteUser);

router.get("/categories", categoriesController.getCategories);
router.get("/categories/:id", categoriesController.getCategoryById);
router.post("/categories", categoriesController.createCategory);
router.put("/categories/:id", categoriesController.updateCategory);
router.delete("/categories/:id", categoriesController.softDeleteCategory);

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.softDeleteProduct);

router.get("/payment-logs", paymentLogsController.getLogs);
router.get("/payment-logs/:id", paymentLogsController.getLogById);
router.post("/payment-logs", paymentLogsController.createLog);

router.get("/transactions", transactionController.getTransactions);
router.get("/transactions/:id", transactionController.getTransactionById);
router.post("/transactions", transactionController.createTransaction);
router.put("/transactions/:id", transactionController.updateTransaction);
router.delete("/transactions/:id", transactionController.softDeleteTransaction);

router.get("/transaction-items", transactionItemsController.getItems);
router.get("/transaction-items/:id", transactionItemsController.getItemById);
router.post("/transaction-items", transactionItemsController.createItem);

router.get("/audit-logs", auditLogsController.getLogs);
router.get("/audit-logs/:id", auditLogsController.getLogById);
router.post("/audit-logs", auditLogsController.createLog);

export default router;
