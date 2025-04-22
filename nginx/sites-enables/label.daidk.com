server {
    server_name label.daidk.com; # Replace with your domain name

    root /git/ddlabel/ ; # The root directory where your static files are located
    index index.html ; # The default file to serve

    location /api {
        proxy_pass http://localhost:5100; # Forward requests to the Flask app
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:3000; # Forward requests to the application running on port 3000
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/label.daidk.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/label.daidk.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    
    client_max_body_size 20M;
}


server {
    if ($host = label.daidk.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name label.daidk.com;

    root /var/www/label.daidk.com;  # Set the root directory for this domain
    index index.html;               # Specify the default index file

    client_max_body_size 20M;       # Allow file uploads up to 20 MB

    location / {
        try_files $uri $uri/ =404;  # Serve files or return 404 if not found
    }
}
