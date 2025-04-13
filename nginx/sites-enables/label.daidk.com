server {
    server_name label.daidk.com;

    root /git/ddlabel/;
    index index.html;

    location /api {
        proxy_pass http://localhost:5100;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Origin $http_origin; # Forward the Origin header

        # Pass all response headers from the backend
        proxy_pass_header Content-Type;
        proxy_pass_header Content-Length;
        proxy_pass_header Authorization;
        proxy_pass_header Access-Control-Allow-Origin;
        proxy_pass_header Access-Control-Allow-Methods;
        proxy_pass_header Access-Control-Allow-Headers;
        proxy_pass_header Access-Control-Allow-Credentials;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/label.daidk.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/label.daidk.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 20M;
}

server {
    if ($host = label.daidk.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name label.daidk.com;
    # Use a separate file for Let's Encrypt verification
    #include /usr/local/etc/nginx/conf.d/letsencrypt.conf;

    client_max_body_size 20M;

    return 404;
}
