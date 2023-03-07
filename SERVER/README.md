## 🚀 Aadhar Payment Recon Service

### Steps to setup project on local
- Create and activate virtualenv (`mkdir env && source env/bin/activate`)
- Start MySQL server (`docker container rm container_mysql --force; docker run -it --rm --name container_mysql -p 3306:3306 -v ~/Databases/MysqlDbDataDir:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=root mysql:5.7`)
- Migrate existing models (`python manage.py migrate`)
- Load fixtures (`python manage.py loaddata centre; python manage.py loaddata service`)
- Start server (`python manage.py runserver 6969`)

### Steps to deploy
- Merge PR against master. Have setup an automatic CI/CD pipeline in Heroku
- Service endpoint: https://aadhaar-payment-recon-service.herokuapp.com/

### List of tables currently
<img width="414" alt="Screenshot 2022-08-21 at 1 44 54 AM" src="https://user-images.githubusercontent.com/20264867/185764642-29afb5e3-48a4-41ef-ab3b-106017fbaa1b.png">

### Important Schemas
- Order table with its indexes
<img width="1282" alt="Screenshot 2022-08-21 at 1 37 47 AM" src="https://user-images.githubusercontent.com/20264867/185764402-b0a74314-7e11-4a02-bd08-9bc4771bf239.png">

### Master Data
- Centres
<img width="976" alt="Screenshot 2022-08-21 at 1 39 04 AM" src="https://user-images.githubusercontent.com/20264867/185764451-2439a346-0389-4e21-984b-192308c56884.png">

- Services
<img width="981" alt="Screenshot 2022-08-21 at 1 39 40 AM" src="https://user-images.githubusercontent.com/20264867/185764465-cf805672-76b5-46b2-a769-10fce6aa43d2.png">

### Required environment variables
```
ENV
db_name
db_username
db_password
db_host
db_port
```
