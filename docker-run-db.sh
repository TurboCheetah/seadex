docker run -d \
    --name seadex-db \
    -e POSTGRES_USER=seadex \
    -e POSTGRES_PASSWORD=password \
    --network host \
    postgres
