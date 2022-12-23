
% Make sure that all workspaces are related explicitly to eachother
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, 'workspace:*', DependencyType) :-
  workspace_ident(_, DependencyIdent),
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, _, DependencyType).

% Make sure that all dependencies are not conflicting in version
gen_enforced_dependency(WorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType) :-
  workspace_has_dependency(WorkspaceCwd, DependencyIdent, DependencyRange, DependencyType),
  workspace_has_dependency(OtherWorkspaceCwd, DependencyIdent, DependencyRange2, DependencyType2),
  DependencyRange \= DependencyRange2.

% Make sure that all packages have the proper module, index/module and exports fields
gen_enforced_field(WorkspaceCwd, 'type', 'module') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'main', './cjs/index.cjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'module', './esm/index.mjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'exports.["."].require', './cjs/index.cjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'exports.["."].import', './esm/index.mjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'exports.["./*"].require', './cjs/*.cjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').
gen_enforced_field(WorkspaceCwd, 'exports.["./*"].import', './esm/*.mjs') :-
  \+ workspace_ident(WorkspaceCwd, 'root').

% Make sure all packages have the correct build configuration
gen_enforced_field(WorkspaceCwd, 'build.preset', '../../../.config/build.config.ts') :-
  \+ workspace_ident(WorkspaceCwd, 'root').

% Make sure all packages have a correct tscmono configuration
gen_enforced_field(WorkspaceCwd, 'tscmono.preset', 'lib') :-
  \+ workspace_ident(WorkspaceCwd, 'root').