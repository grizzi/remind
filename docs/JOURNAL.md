# Journal

- Fronted App created with vite starting from scratch to learn about the build
  process and all the tooling
- Starting to explore django rest framework, created the first views
- Learnt about JWT authentication and how to use it with django rest framework
- Created a simple react app with JWT authentication, handling these by "hand"
  requires quite some manual work, the api calls for authentication are spread
  all over the places..., also why it is so difficult to make backend and
  frontend agree on the structure of data?
- I have found `zod` to enforce the structure of data in the frontend. With a
  bit of work, this reduced a lot the amount of "manual" verification that I
  have to do
- Handling dates is terrible in JS, when typed as string it is not clear what
  the format is and how to make frontend and backend agree on it
- I will not support different date timezones for now. I will just rely on the
  fact that the backend and frontend are in the same timezone (UTC)
- Ok, date works, initially I had datetime objects, but then I moved to just
  dates since I do not need to be precise to the hour
- The UI is mature enough now, I decided that storing transactions for each user
  is not needed. Instead I will do the following:
  - for each subscription allow to store multiple `Plans`
  - for each plan allow to change lot of things (currency, price, date, etc)
  - then the statistics, alerts and so on can always be calculated on the fly.
  - storing transactions that are the result of an existing plan would mean that
    every time the plan is changed we would have to propagate the changes to all
    the transactions back in time. This is too much work. If I want to persist
    transactions which are results of past plans or portion of them in next
    revisions I can always do it through different methods that I do not plan to
    implement now, for example:
    - do not allow to change a plan in the past, store the plan that changes in
      the future as a separate plan although only the most up to date plan is
      shown in the UI
- Plans simplified a lot the problem. Now I can focus on the backend, email and
  notification system
- I have found `celery` to handle the asynchronous tasks. I will use it to send
  emails and notifications
- Running celery means that redis + postgres + django + celery are all running
  in the same container. This is not ideal, but I do not want to add more
  complexity to the setup for now. I will just run everything in the same
  container and see how it goes
- This is too complicated and not ideal for testing/shipping and future
  deployment. I like using container, `docker compose` seems to be a good
  solution
- I have managed to setup docker compose for local development. It took a while
  to configure it to do what I wanted but now everything runs smoothly. I have
  to remember to restart celery if I apply changes to the tasks, since it does
  not have hot reload like for django
- I can now send confirmation emails when a user registers, using django
  templates. There is no "confirm your email step", maybe I will add it later if
  I have time
- I am using `mailhog` to test sending emails. It is a great tool to test
  sending emails locally. I can send emails to any address and they will be
  stored in the mailhog server. I can then access them through a web interface
- Adding the alerting logic and the corresponding unit tests (WIP)
- Function to send alert based on user settings and basic alert unittesting done
- Function that auto-renews plans if they autorenew and corresponding testing
  and marking others as expired
  - Note: the handling of time is really naive!
    - Not considering timezones
    - Not considering leap years
    - Errors might cumulate over time for long term subscriptions

### TODOs

- [ ] Function to create a monthly report based on user subscriptions
- [ ] Test monthly report generation
- [ ] Make it clear that no multi-currency are allowed. So change all the
      currency to reflect the user's currency
- [ ] Filtering in the subscrition list

### WHISHLIST

- [ ] Reset your password
- [ ] OAuth authentication
- [ ] Choose settings on the first login
- [ ] Proper handling of time and timezones (it could be part of user settings)
