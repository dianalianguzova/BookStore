# Описание API
BookStoreAPI - api, предоставляющее функциональность книжного интернет-магазина.

# ER-диаграмма
На диаграмме представлена структура таблиц базы данных.

![ER-диаграмма](ER.png)

# Маршруты API
## Маршруты BookProduct
### GET
- **Получение списка всех книжных продуктов**: `https://localhost:5001/`
- **Получение списка всех книг**: `https://localhost:5001/books`
- **Получение списка всех комиксов**: `https://localhost:5001/comics`
- **Получение информации об одном книжном продукте по ID**: `https://localhost:5001/product/{id}`
### POST
- **Добавление нового книжного продукта**: `https://localhost:5001/`
### PUT
- **Изменение книжного продукта по ID**: `https://localhost:5001/products/{id}`
### DELETE
- **Удаление книжного продукта по ID**: `https://localhost:5001/products/{id}`

## Маршруты Category
### GET
- **Получение списка всех категорий**: `https://localhost:5001/categories`
- **Получение списка книжных продуктов по ID категории**: `https://localhost:5001/categories/{id}`
### POST
- **Добавление новой категории**: `https://localhost:5001/categories`
### PUT
- **Изменение категории по ID**: `https://localhost:5001/categories/{id}`
### DELETE
- **Удаление категории по ID**: `https://localhost:5001/categories/{id}`

## Маршруты Cart
### GET
- **Получение списка всех корзин**: `https://localhost:5001/cart/all`
- **Получение списка всех продуктов в корзине по ID корзины**: `https://localhost:5001/cart/{id}`
- **Получение информации об одном продукте из корзины по ID корзины и ID продукта**: `https://localhost:5001/cart/{id}/item/{itemid}`
### POST
- **Добавление продукта в корзину по ID корзины**: `https://localhost:5001/cart/{id}/item`
### DELETE
- **Удаление одного продукта из корзины по ID корзины и ID продукта**:  `https://localhost:5001/cart/{id}/item/{itemid}`
- **Удаление содержимого корзины по ID корзины**:  `https://localhost:5001/cart/{id}`

## Маршруты Order
### GET
- **Получение списка всех заказов**: `https://localhost:5001/order/all`
- **Получение заказа по ID**: `https://localhost:5001/order/{id}`
- **Получение информации об одном продукте из заказа по ID заказа и ID продукта**: `https://localhost:5001/order/{id}/item/{itemid}`
### POST
- **Добавление нового заказа**: `https://localhost:5001/order`
### PUT
- **Изменение заказа по ID**: `https://localhost:5001/order/{id}`
### DELETE
- **Удаление заказа по ID**: `https://localhost:5001/order/{id}`

## Маршруты User
### GET
- **Получение списка всех пользователей**: `https://localhost:5001/user/all`
- **Получение всех заказов пользователя по его ID**: `https://localhost:5001/user/{id}/orders`
- **Получение содержимого корзины пользователя по его ID**: `https://localhost:5001/user/{id}/cart`
### POST
- **Добавление нового пользователя**: `https://localhost:5001/user/register`
### PUT
- **Изменение информации о пользователе по его ID**: `https://localhost:5001/user/{id}`
### DELETE
- **Удаление пользователя по его ID**: `https://localhost:5001/user/{id}`

## Swagger
  `https://localhost:5001/swagger/index.html`
