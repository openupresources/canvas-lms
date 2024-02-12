# Getting Canvas up and running for Open Up Resources dev

Setting up a local instance of Canvas will allow us to test LTI requests with a local instance of the curriculum gateway. Luckily, the Canvas repo includes Docker support.

This fork of the Canvas source code adds to this README, and a docker-compose override file that follows our Open Up Resources dev conventions and allows the Canvas container to connect to our other containers on localhost.

After you download this source code, open your Mac terminal the canvas-lms directory then run the following commands. You will end up with a local instance of Canvas at the URL http://canvas.openup.local

Note the `db:initial_setup` command will prompt you for an admin email and password for the Canvas app. This can be whatever you want, e.g. `dev@test.org/password`.

1. `cp ./docker-compose/openupresources.override.yml ./docker-compose.override.yml`
1. `touch ./.env`
1. `cp docker-compose/config/*.yml config/`
1. `docker compose build --pull`
1. `docker compose up --no-start web`
1. `docker compose run --rm web ./script/install_assets.sh`
1. `docker compose run --rm web bundle install`
1. `docker compose run --rm web bundle exec rake js:yarn_install`
1. `docker compose run --rm web bundle exec rails canvas:compile_assets_dev`
1. `docker compose run --rm web bundle exec rake db:create db:initial_setup`
1. `docker compose run --rm web bundle exec rake db:migrate`
1. `docker compose up -d`


There are some additional services you can configure if wanted—see `developing_with_docker.md` for details—but you shouldn't need them for testing LTI connectivity.
