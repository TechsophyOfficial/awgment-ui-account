FROM nginx:1.17.8-alpine
RUN mkdir -p /usr/share/nginx/html/account
COPY build/. /usr/share/nginx/html/account
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY env2Json.sh .
COPY run.sh .
EXPOSE 80 443
CMD ["./run.sh"]
