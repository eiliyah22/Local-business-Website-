
USE maicookies;

-- One UPDATE per cookie (cookie_id picks the row).
UPDATE cookies SET name = 'Dark Chocolate', price = 60,  image = 'images/image1.png' WHERE cookie_id = 1;
UPDATE cookies SET name = 'Nutella',        price = 125, image = 'images/image6.png' WHERE cookie_id = 2;
UPDATE cookies SET name = 'Marshmallow',    price = 100, image = 'images/image5.png' WHERE cookie_id = 3;
UPDATE cookies SET name = 'Biscoff',        price = 125, image = 'images/image7.JPG' WHERE cookie_id = 4;
UPDATE cookies SET name = 'Oreo',           price = 100, image = 'images/image3.png' WHERE cookie_id = 5;
UPDATE cookies SET name = 'Kinder',         price = 150, image = 'images/image8.jpg' WHERE cookie_id = 6;
UPDATE cookies SET name = 'Smarties',       price = 100, image = 'images/image4.png' WHERE cookie_id = 7;
UPDATE cookies SET name = 'Classic',        price = 70,  image = 'images/image2.png' WHERE cookie_id = 8;

-- Some stock values had a hidden line break ("Available\r\n"), so set them all the same.
UPDATE cookies SET stock = 'Available';

-- Remove trailing spaces from the descriptions.
UPDATE cookies SET description = TRIM(description);
