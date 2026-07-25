'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Button,
  Callout,
  Quote,
  Badge,
  PageHero,
  Text,
  List,
  ListItem,
  ProcessPipeline,
  Chart,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Container,
  Divider,
  Title,
} from 'glt-ui';

/**
 * Slim practical demo: composes only components kept for the research portal.
 */
export function PracticalDemo() {
  return (
    <div className="space-y-10 pb-16">
      <PageHero
        badge={<Badge>GLT UI · slim</Badge>}
        title="Research portal component set"
        lead="Only the primitives the research portal actually imports — plus transitive atoms those need."
        actions={<Button>Open research</Button>}
      />

      <Container>
        <div className="space-y-8">
          <Callout title="Why slim?" variant="info">
            The published design system tracks portal usage. Unused forms, nav chrome, and
            speculative widgets were removed so the package stays easy to maintain.
          </Callout>

          <Quote
            cite="Gary@gaplo.tech"
            source={<>Author, GLT Research · July 2026</>}
          >
            Code is cheap, show me the Harness and Loop
          </Quote>

          <div>
            <Title size={3} className="mb-3">
              Process
            </Title>
            <ProcessPipeline
              nodes={[
                { id: 'signal', label: 'Signal', sublabel: 'Industry evidence' },
                { id: 'author', label: 'Author', sublabel: 'Hand-built essay' },
                { id: 'ship', label: 'Ship', sublabel: 'Static export' },
              ]}
            />
          </div>

          <Divider />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-2 p-5">
                <Badge>Keep</Badge>
                <Title size={5}>Portal-used</Title>
                <Text size="sm" tone="secondary">
                  Chart, Table, Quote, Figure shells, Site chrome, PageHero, …
                </Text>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <Badge variant="neutral">Transitive</Badge>
                <Title size={5}>Internals</Title>
                <Text size="sm" tone="secondary">
                  Button, Icon, Spinner — only because Callout/Card/Quote need them.
                </Text>
              </CardContent>
            </Card>
          </div>

          <div>
            <Title size={4} className="mb-3">
              Sample chart
            </Title>
            <Chart
              type="bar"
              labels={['A', 'B', 'C']}
              series={[{ label: 'Share', data: [12, 48, 34], color: 'brand' }]}
              height={220}
            />
          </div>

          <div>
            <Title size={4} className="mb-3">
              Sample table
            </Title>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Component</TableHeaderCell>
                  <TableHeaderCell>Role</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>FullBleedFigure</TableCell>
                  <TableCell>Essay figures</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SiteHeader</TableCell>
                  <TableCell>Portal chrome</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <List>
            <ListItem>
              Import only from <code>glt-ui</code> public exports.
            </ListItem>
            <ListItem>
              Rebuild <code>dist/</code> after source edits.
            </ListItem>
          </List>
        </div>
      </Container>
    </div>
  );
}
