# Tasks

## Overall Goal
Support an architecture where an AI agent operates within a Docker container to automatically read and update tasks via a local JSON-backed file system (acting as a "lite Airtable" locally). The human operator should be able to oversee the agent's work and intervene concurrently without causing data loss or complex migration headaches.

## TODO

- [x] be able to run outside of docker for local development. So do not mention in SKILLS document, but does in README.
- [x] look if there is a nodejs library we could use for maintaining the local json database instead of hardcoding the logic
- [x] need to support mutliple tables and each one has a unique identifier
- [x] add unit and integration tests for the whole app
- [x] use a better nodejs server with strict typing (joi?)
- [ ] how do you add how the workflow is defined? A task is at which stage?
- [ ] copy RedactSolo workflow and use it as an "example" of what needs to be working
- [ ] add idle time on Docker container
- [ ] improve the start/stop/status commands. Show just simple responses, only show details if something goes wrong
- [ ] setup mutagen and core tunnel so we can observe the container in VPS
