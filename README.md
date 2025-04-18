# Описание 
BookStore - книжный интернет-магазин.

## 🛠 Технологии
| Backend | Frontend |
|--------|----------|
| PostgreSQL | VanillaJS  | 
| Entity Framework | HTML/CSS |
| ASP.NET Core 8.0 |  |

# ER-диаграмма
На диаграмме представлена структура таблиц базы данных.

![ER-диаграмма](ER.png)

# API endpoints
## BookProduct 

| Method | Endpoint | Description | Swagger | Postman |
|--------|----------|-------------|---------|---------|
| GET | `/` | Получение списка всех книжных продуктов | [📎 OK](swagger/get_all_bookproducts.png) | [📎 OK](postman/get_bookproducts.png) |
| GET | `/product/{id}` | Получение информации о продукте | [📎 OK](swagger/get_bookproduct_info.png) | [📎 OK](postman/get_bookproduct_info.png) |
| POST | `/` | Добавление нового книжного продукта | [📎 OK](swagger/post_bookproduct.png) | [📎 OK](postman/post_bookproduct.png) |
| PUT | `/products/{id}` | Изменение продукта | [📎 OK](swagger/put_bookproduct.png) | [📎 OK](postman/put_bookproduct.png) |
| DELETE | `/products/{id}` | Удаление продукта | [📎 OK](swagger/delete_bookproduct.png) | [📎 OK](postman/delete_bookproduct.png) |

## User 

| Method | Endpoint | Description | Swagger | Postman |
|--------|----------|-------------|---------|---------|
| GET | `/user/all` | Получение списка пользователей | [📎 OK](swagger/get_allusers.png) | [📎 OK](postman/get_allusers.png) |
| GET | `/user/{id}` | Информация о пользователе | [📎 OK](swagger/get_userinfo.png) | [📎 OK](postman/get_userinfo.png) |
| GET | `/user/{id}/orders` | Получение заказов пользователя | [📎 OK](swagger/get_userorsers.png) | [📎 OK](postman/get_userorsers.png) |
| GET | `/user/{id}/cart` | Получение корзины пользователя | [📎 OK](swagger/get_usercart.png) | [📎 OK](postman/get_usercart.png) |
| GET | `/user/check-phone/{phone}` | Проверка на авторизацию по номеру телефона | [📎 OK](swagger/checkphone_user.png) | [📎 OK](postman/checkphone_user.png) |
| POST | `/user/register` | Регистрация нового пользователя | [📎 OK](swagger/post_newuser.png) | [📎 OK](postman/post_newuser.png) |
| PUT | `/user/{id}` | Изменение данных пользователя | [📎 OK](swagger/put_user.png) | [📎 OK](postman/put_user.png) |
| DELETE | `/user/{id}` | Удаление пользователя | [📎 OK](swagger/delete_user.png) | [📎 OK](postman/delete_user.png) |

## Cart 

| Method | Endpoint | Description | Swagger | Postman |
|--------|----------|-------------|---------|---------|
| GET | `/cart/all` | Получение списка всех корзин | [📎 OK](swagger/get_allcarts.png) | [📎 OK](postman/get_allcarts.png) |
| GET | `/cart/{id}` | Получение содержимого корзины | [📎 OK](swagger/get_cartinfo.png) |  [📎 OK](postman/get_cartinfo.png) |
| GET | `/cart/{id}/item/{itemid}` | Получение информации об одном элементе корзины | [📎 OK](swagger/get_cart_iteminfo.png) | [📎 OK](postman/get_cart_iteminfo.png) |
| GET | `/cart/user/{userId}` | Получение ID корзины по ID пользователя | [📎 OK](swagger/get_cartid.png) | [📎 OK](postman/get_cartid.png) |
| GET | `/cart/session/{sessionId}` | Получение ID корзины по сессионному ID | [📎 OK](swagger/get_cartid_session.png) | [📎 OK](postman/get_cartid_session.png) |
| POST | `/cart/{id}/item` | Добавление продукта в корзину по ID пользователя/сессии | [📎 OK](swagger/post_item_incart.png) | [📎 OK](postman/post_item_incart.png) |
| POST | `/cart/create/{sessionId}` | Создание сессионной корзины | [📎 OK](swagger/create_sessioncart.png) | [📎 OK](postman/create_sessioncart.png) |
| PUT | `/cart/item/update/{cartItemId}` | Изменение количества товара | [📎 OK](swagger/put_cartitem.png) | [📎 OK](postman/put_cartitem.png) |
| DELETE | `/cart/{id}/item/{itemid}` | Удаление продукта из корзины по ID пользователя/сессии | [📎 OK](swagger/delete_cartitem.png) | [📎 OK](postman/delete_cartitem.png) |
| DELETE | `/cart/{id}` | Удаление содержимого корзины | [📎 OK](swagger/delete_cart.png) | [📎 OK](postman/delete_cart.png) |
| DELETE | `/cart/session/{id}` | Удаление сессионной корзины | [📎 OK](swagger/delete_sessioncart.png) | [📎 OK](postman/delete_sessioncart.png) |

## Category

| Method | Endpoint | Description | Swagger | Postman |
|--------|----------|-------------|---------|---------|
| GET | `/categories` | Получение списка всех категорий | [📎 OK](swagger/get_allcategories.png) | [📎 OK](postman/get_allcategories.png) |
| GET | `/categories/{id}` | Получение продуктов по категории | [📎 OK](swagger/get_categoryproducts.png) | [📎 OK](postman/get_categoryproducts.png) |
| POST | `/categories` | Добавление новой категории | [📎 OK](swagger/post_category.png) | [📎 OK](postman/post_category.png) |
| PUT | `/categories/{id}` | Изменение категории | [📎 OK](swagger/put_category.png) | [📎 OK](postman/put_category.png) |
| DELETE | `/categories/{id}` | Удаление категории | [📎 OK](swagger/delete_category.png) | [📎 OK](postman/delete_category.png) |

## Order 

| Method | Endpoint | Description | Swagger | Postman |
|--------|----------|-------------|---------|---------|
| GET | `/order/all` | Получение списка всех заказов | [📎 OK](swagger/get_allorders.png) | [📎 OK](postman/get_allorders.png) |
| GET | `/order/{id}` | Получение заказа по ID | [📎 OK](swagger/get_order.png) | [📎 OK](postman/get_order.png) |
| GET | `/order/{id}/item/{itemid}` | Получение информации о продукте из заказа | [📎 OK](swagger/get_order_iteminfo.png) | [📎 OK](postman/get_order_iteminfo.png) |
| POST | `/order` | Создание нового заказа | [📎 OK](swagger/post_order.png) | [📎 OK](postman/post_order.png) |
| PUT | `/order/{id}` | Изменение заказа | [📎 OK](swagger/put_order.png) | [📎 OK](postman/put_order.png) |
| DELETE | `/order/{id}` | Удаление заказа | [📎 OK](swagger/delete_order.png) | [📎 OK](postman/delete_order.png) |

# BookStore
📌 **Главная страница**: `/bookstore.html`

📌 **Личный кабинет**: `/auth.html`

📌 **Корзина**: `/cart.html`
  
📌 **Категории**: `/categories.html`

📌 **Заказы**: `/orders.html`

📌 **Страница продукта**: `/product-info.html`