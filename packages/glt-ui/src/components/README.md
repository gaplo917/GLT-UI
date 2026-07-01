# Components — Atomic Design

Components are organized by [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/)
layer. Dependencies point **downward** only: an organism may compose molecules
and atoms, a molecule may compose atoms, and atoms compose nothing but raw HTML.

| Layer | What lives here | Examples |
| --- | --- | --- |
| **atoms** | Indivisible primitives — a single element or the smallest useful wrapper. | `Text`, `Title`, `Icon`, `Button`, `Badge`, `Surface`, `Block`, `Stack`, `Grid` |
| **molecules** | A small group of atoms working as one unit. | `FormField`, `MediaObject`, `Callout`, `StatMetric`, `TagGroup`, `DropdownMenu` |
| **organisms** | Distinct, self-contained sections built from molecules and atoms. | `Card`, `Navbar`, `Tabs`, `Accordion`, `DataTable`, `PageHero` |
| **templates** | Page-level layout scaffolds that arrange organisms — content-agnostic. | `Section` |
| **pages** | Concrete instances of templates with real content. | _App-level_ — see `components/docs/` in the host app (e.g. `PracticalDemo`). |

The public API is unchanged: everything is re-exported from `components/index.ts`
and consumed via `import { ... } from 'glt-ui'`. Folder structure is an
internal implementation detail.
