# Sync Generators

In Nx 19.8, you can use sync generators to ensure that your repository is maintained in a correct state. One specific application is to use the project graph to update files. These can be global configuration files or scripts, or at the task level to ensure that files are in sync before a task is run.

Sync Generator Examples:

- Update a custom CI script with binning strategies based on the current project graph
- Update TypeScript config files with project references based on the current project graph
- Ensure code is formatted in a specific way before CI is run

## Task Sync Generators

Sync generators can be associated with a particular task. Nx will use the sync generator to ensure that code is correctly configured before running the task.
Nx does this in different ways, depending on whether the task is being run on a developer machine or in CI.

On a developer machine, the sync generator is run in `--dry-run` mode and if files would be changed by the generator, the user is prompted to run the generator or skip it. This prompt can be disabled by setting the `sync.applyChanges` property to `true` or `false` in the `nx.json` file.

In CI, the sync generator is run in `--dry-run` mode and if files would be changed by the generator, the task fails with an error provided by the sync generator. The sync generator can be skipped in CI by passing the `--skip-sync` flag when executing the task or you can skip an individual sync generator by adding that generator to the `sync.disabledTaskSyncGenerators` in `nx.json`.

Task sync generators can be thought of like the `dependsOn` property, but for generators instead of task dependencies.

To [register a generator](/extending-nx/recipes/create-sync-generator) as a sync generator for a particular task, add the generator to the `syncGenerators` property of the task configuration.

## Global Sync Generators

Global sync generators are not associated with a particular task and are executed only when the `nx sync` or `nx sync:check` command is explicitly run. They are [registered](/extending-nx/recipes/create-sync-generator) in the `nx.json` file with the `sync.globalGenerators` property.

## Sync the Project Graph and the File System

Nx processes the file system in order to [create the project graph](/features/explore-graph) which is used to run tasks in the correct order and determine project dependencies. Sync generators allow you to also go the other direction and use the project graph to update the file system.

{% side-by-side %}

```{% fileName="File System" %}
└─ myorg
   ├─ apps
   │  ├─ app1
   │  └─ app1
   ├─ libs
   │  └─ lib
   ├─ nx.json
   └─ package.json
```

{% graph title="Project Graph" height="200px" type="project" jsonFile="shared/mental-model/three-projects.json" %}
{% /graph %}
{% /side-by-side %}

The ability to update the file system from the project graph makes it possible to use the Nx project graph to change the behavior of other tools that are not part of the Nx ecosystem.

## Run `nx sync:check` in CI

Task sync generators are executed whenever their task is run, but global sync generators need to be triggered manually with `nx sync`. In order to effectively use sync generators, make sure to add `nx sync:check` to the beginning of your CI scripts so that CI can fail quickly if the code is out of sync. It is also helpful to run `nx sync` in a pre-commit or pre-push Git hook to encourage developers to commit code that is already in sync.