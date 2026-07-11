'use client';
import {
  FormField,
  TextInput,
  TextArea,
  SelectField,
  Checkbox,
  Radio,
  Switch,
} from 'glt-ui';
import type { DocSection } from '../types';

export const formsSection: DocSection = {
  id: 'forms',
  title: 'Forms',
  blurb: 'Inputs, toggles, and form scaffolding.',
  entries: [
    {
      id: 'form-field',
      name: 'FormField',
      description:
        'Labeled wrapper for a single control, with optional hint, required marker, and error message.',
      importLine: "import { FormField } from 'glt-ui';",
      examples: [
        {
          title: 'Label, hint & required',
          description: 'A required field with a helper hint below the control.',
          previewClassName: 'max-w-md',
          code: `<FormField
  label="Organization name"
  htmlFor="org-name"
  required
  hint="Shown on invoices and reports."
>
  <TextInput id="org-name" placeholder="Acme Inc." />
</FormField>`,
          render: (
            <FormField
              label="Organization name"
              htmlFor="org-name"
              required
              hint="Shown on invoices and reports."
            >
              <TextInput id="org-name" placeholder="Acme Inc." />
            </FormField>
          ),
        },
        {
          title: 'Error state',
          description: 'An error message pairs with an invalid input.',
          previewClassName: 'max-w-md',
          code: `<FormField
  label="Work email"
  htmlFor="work-email"
  error="Enter a valid email address."
>
  <TextInput id="work-email" defaultValue="not-an-email" invalid />
</FormField>`,
          render: (
            <FormField
              label="Work email"
              htmlFor="work-email"
              error="Enter a valid email address."
            >
              <TextInput id="work-email" defaultValue="not-an-email" invalid />
            </FormField>
          ),
        },
      ],
    },
    {
      id: 'text-input',
      name: 'TextInput',
      description:
        'Single-line text field with three sizes plus invalid and disabled states.',
      importLine: "import { TextInput } from 'glt-ui';",
      examples: [
        {
          title: 'Sizes',
          description: 'The inputSize prop scales padding and typography.',
          previewClassName: 'max-w-md',
          code: `<div className="flex flex-col gap-3">
  <TextInput inputSize="sm" placeholder="Small" />
  <TextInput inputSize="md" placeholder="Medium (default)" />
  <TextInput inputSize="lg" placeholder="Large" />
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <TextInput inputSize="sm" placeholder="Small" />
              <TextInput inputSize="md" placeholder="Medium (default)" />
              <TextInput inputSize="lg" placeholder="Large" />
            </div>
          ),
        },
        {
          title: 'Invalid',
          description: 'The invalid prop applies error styling.',
          previewClassName: 'max-w-md',
          code: `<TextInput invalid defaultValue="bad value" />`,
          render: <TextInput invalid defaultValue="bad value" />,
        },
        {
          title: 'Disabled',
          description: 'Native disabled attribute prevents interaction.',
          previewClassName: 'max-w-md',
          code: `<TextInput disabled placeholder="Unavailable" />`,
          render: <TextInput disabled placeholder="Unavailable" />,
        },
      ],
    },
    {
      id: 'text-area',
      name: 'TextArea',
      description:
        'Multi-line text field sharing the TextInput sizing and invalid styling.',
      importLine: "import { TextArea } from 'glt-ui';",
      examples: [
        {
          title: 'Default',
          description: 'A basic multi-line field with rows set.',
          previewClassName: 'max-w-md',
          code: `<TextArea rows={4} placeholder="Describe your use case…" />`,
          render: <TextArea rows={4} placeholder="Describe your use case…" />,
        },
        {
          title: 'Invalid',
          description: 'The invalid prop applies error styling.',
          previewClassName: 'max-w-md',
          code: `<TextArea
  rows={3}
  invalid
  defaultValue="Too short."
/>`,
          render: <TextArea rows={3} invalid defaultValue="Too short." />,
        },
      ],
    },
    {
      id: 'select-field',
      name: 'SelectField',
      description:
        'Styled native select driven by an options array, with sizing and invalid states.',
      importLine: "import { SelectField } from 'glt-ui';",
      examples: [
        {
          title: 'Basic select',
          description: 'Options are supplied as value/label pairs.',
          previewClassName: 'max-w-md',
          code: `<SelectField
  defaultValue="research"
  options={[
    { value: 'research', label: 'Research' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'operations', label: 'Operations' },
  ]}
/>`,
          render: (
            <SelectField
              defaultValue="research"
              options={[
                { value: 'research', label: 'Research' },
                { value: 'engineering', label: 'Engineering' },
                { value: 'operations', label: 'Operations' },
              ]}
            />
          ),
        },
        {
          title: 'Small & invalid',
          description: 'Combine inputSize with the invalid flag.',
          previewClassName: 'max-w-md',
          code: `<SelectField
  inputSize="sm"
  invalid
  options={[
    { value: '', label: 'Select a team…' },
    { value: 'a', label: 'Team A' },
    { value: 'b', label: 'Team B' },
  ]}
/>`,
          render: (
            <SelectField
              inputSize="sm"
              invalid
              options={[
                { value: '', label: 'Select a team…' },
                { value: 'a', label: 'Team A' },
                { value: 'b', label: 'Team B' },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: 'checkbox',
      name: 'Checkbox',
      description:
        'Labeled checkbox supporting checked, unchecked, and disabled states.',
      importLine: "import { Checkbox } from 'glt-ui';",
      examples: [
        {
          title: 'States',
          description: 'Checked, unchecked, and disabled variants.',
          code: `<div className="flex flex-col gap-2">
  <Checkbox label="Unchecked" />
  <Checkbox label="Checked" defaultChecked />
  <Checkbox label="Disabled" disabled />
  <Checkbox label="Disabled & checked" disabled defaultChecked />
</div>`,
          render: (
            <div className="flex flex-col gap-2">
              <Checkbox label="Unchecked" />
              <Checkbox label="Checked" defaultChecked />
              <Checkbox label="Disabled" disabled />
              <Checkbox label="Disabled & checked" disabled defaultChecked />
            </div>
          ),
        },
        {
          title: 'Single opt-in',
          description: 'A standalone consent checkbox.',
          code: `<Checkbox id="terms" label="I agree to the terms" />`,
          render: <Checkbox id="terms" label="I agree to the terms" />,
        },
      ],
    },
    {
      id: 'radio',
      name: 'Radio',
      description:
        'Labeled radio button; group several together by sharing a name.',
      importLine: "import { Radio } from 'glt-ui';",
      examples: [
        {
          title: 'Radio group',
          description: 'Radios sharing name="mode" form a single selection.',
          code: `<div className="flex flex-col gap-2">
  <Radio name="mode" label="Automatic" defaultChecked />
  <Radio name="mode" label="Manual" />
  <Radio name="mode" label="Scheduled" />
</div>`,
          render: (
            <div className="flex flex-col gap-2">
              <Radio name="mode" label="Automatic" defaultChecked />
              <Radio name="mode" label="Manual" />
              <Radio name="mode" label="Scheduled" />
            </div>
          ),
        },
        {
          title: 'Single option',
          description: 'A lone radio with an explicit id.',
          code: `<Radio id="opt-a" name="plan" label="Standard plan" />`,
          render: <Radio id="opt-a" name="plan" label="Standard plan" />,
        },
      ],
    },
    {
      id: 'switch',
      name: 'Switch',
      description:
        'Toggle control for boolean settings, with on, off, and disabled states.',
      importLine: "import { Switch } from 'glt-ui';",
      examples: [
        {
          title: 'States',
          description: 'On, off, and disabled toggles.',
          code: `<div className="flex flex-col gap-3">
  <Switch label="Notifications on" defaultChecked />
  <Switch label="Notifications off" />
  <Switch label="Disabled" disabled />
</div>`,
          render: (
            <div className="flex flex-col gap-3">
              <Switch label="Notifications on" defaultChecked />
              <Switch label="Notifications off" />
              <Switch label="Disabled" disabled />
            </div>
          ),
        },
        {
          title: 'Single setting',
          description: 'A standalone toggle with an id.',
          code: `<Switch id="beta" label="Enable beta features" />`,
          render: <Switch id="beta" label="Enable beta features" />,
        },
      ],
    },
  ],
};
