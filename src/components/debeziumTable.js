import React from 'react';
import {
  Button,
  ButtonVariant,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelBody,
  DrawerPanelContent,
  DrawerHead,
  DropdownToggleCheckbox,
  Toolbar,
  ToolbarItem,
  ToolbarContent,
  ToolbarFilter,
  ToolbarToggleGroup,
  ToolbarGroup,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  InputGroup,
  Title,
  TitleSizes,
  TextInput,
  Select,
  SelectOption,
  SelectVariant,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Modal
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/js/icons/search-icon';
import FilterIcon from '@patternfly/react-icons/dist/js/icons/filter-icon';
import ExportIcon from '@patternfly/react-icons/dist/js/icons/export-icon';
import EllipsisVIcon from '@patternfly/react-icons/dist/js/icons/ellipsis-v-icon';
import ExternalLinkIcon from '@patternfly/react-icons/dist/js/icons/external-link-alt-icon'
import ExchangeAltIcon from '@patternfly/react-icons/dist/js/icons/exchange-alt-icon';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import DebeziumWizard from './debeziumWizard';
import Notebook from './notebook';

function dataCapturesToRows(instances) {
  return instances.map(({ name, namespace, connector, connectorURL, connectorPort, databaseName }) => (
    { cells: [
      name,
      namespace,
      connector,
      connectorURL,
      connectorPort,
      databaseName
    ] }
  ));
}

function getDataCaptures() {
  let dataCaptures = localStorage.getItem('dataCaptures')
  return dataCaptures ? JSON.parse(dataCaptures) : [];
}

class DebeziumTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: {
        location: [],
        name: [],
        status: []
      },
      currentCategory: 'Name',
      isBulkSelectDropdownOpen: false,
      isFilterDropdownOpen: false,
      isCategoryDropdownOpen: false,
      isDrawerExpanded: false,
      isWizardOpen: false,
      nameInput: '',
      columns: [
        { title: 'Name' },
        { title: 'Namespace' },
        { title: 'Connector' },
        { title: 'Connector URL' },
        { title: 'Connector port' },
        { title: 'Database name' },
      ],
      instances: props.instances,
      rows: dataCapturesToRows(getDataCaptures()),
      inputValue: '',
    };

    this.onDelete = (type = '', id = '') => {
      if (type) {
        this.setState(prevState => {
          prevState.filters[type.toLowerCase()] = prevState.filters[type.toLowerCase()].filter(s => s !== id);
          return {
            filters: prevState.filters
          };
        });
      } else {
        this.setState({
          filters: {
            location: [],
            name: [],
            status: []
          }
        });
      }
    };

    this.onBulkSelectDropdownToggle = isOpen => {
      this.setState({
        isBulkSelectDropdownOpen: isOpen
      });
    }

    this.onCategoryToggle = isOpen => {
      this.setState({
        isCategoryDropdownOpen: isOpen
      });
    };

    this.onCategorySelect = event => {
      this.setState({
        currentCategory: event.target.innerText,
        isCategoryDropdownOpen: !this.state.isCategoryDropdownOpen
      });
    };

    this.onFilterToggle = isOpen => {
      this.setState({
        isFilterDropdownOpen: isOpen
      });
    };

    this.onFilterSelect = event => {
      this.setState({
        isFilterDropdownOpen: !this.state.isFilterDropdownOpen
      });
    };

    this.onInputChange = newValue => {
      this.setState({ inputValue: newValue });
    };

    this.onRowSelect = (event, isSelected, rowId) => {
      let rows;
      if (rowId === -1) {
        rows = this.state.rows.map(oneRow => {
          oneRow.selected = isSelected;
          return oneRow;
        });
      } else {
        rows = [...this.state.rows];
        rows[rowId].selected = isSelected;
      }
      this.setState({
        rows
      });
    };

    this.onStatusSelect = (event, selection) => {
      const checked = event.target.checked;
      this.setState(prevState => {
        const prevSelections = prevState.filters['status'];
        return {
          filters: {
            ...prevState.filters,
            status: checked ? [...prevSelections, selection] : prevSelections.filter(value => value !== selection)
          }
        };
      });
    };

    this.onNameInput = event => {
      if (event.key && event.key !== 'Enter') {
        return;
      }

      const { inputValue } = this.state;
      this.setState(prevState => {
        const prevFilters = prevState.filters['name'];
        return {
          filters: {
            ...prevState.filters,
            ['name']: prevFilters.includes(inputValue) ? prevFilters : [...prevFilters, inputValue]
          },
          inputValue: ''
        };
      });
    };

    this.onLocationSelect = (event, selection) => {
      this.setState(prevState => {
        return {
          filters: {
            ...prevState.filters,
            ['location']: [selection]
          }
        };
      });
      this.onFilterSelect();
    };

    this.actions = [
      {
        title: 'View configuration'
      },
      {
        title: 'Manage users'
      }
    ];
  }

  buildCategoryDropdown() {
    const { isCategoryDropdownOpen, currentCategory } = this.state;

    return (
      <ToolbarItem>
        <Dropdown
          onSelect={this.onCategorySelect}
          position={DropdownPosition.left}
          toggle={
            <DropdownToggle onToggle={this.onCategoryToggle} style={{ width: '100%' }}>
              <FilterIcon /> {currentCategory}
            </DropdownToggle>
          }
          isOpen={isCategoryDropdownOpen}
          dropdownItems={[
            <DropdownItem key="cat1">Location</DropdownItem>,
            <DropdownItem key="cat2">Name</DropdownItem>,
            <DropdownItem key="cat3">Status</DropdownItem>
          ]}
          style={{ width: '100%' }}
        ></Dropdown>
      </ToolbarItem>
    );
  }

  buildFilterDropdown() {
    const { currentCategory, isFilterDropdownOpen, inputValue, filters } = this.state;

    const locationMenuItems = [
      <SelectOption key="raleigh" value="Raleigh" />,
      <SelectOption key="westford" value="Westford" />,
      <SelectOption key="boston" value="Boston" />,
      <SelectOption key="brno" value="Brno" />,
      <SelectOption key="bangalore" value="Bangalore" />
    ];

    const statusMenuItems = [
      <SelectOption key="statusRunning" value="Running" />,
      <SelectOption key="statusStopped" value="Stopped" />,
      <SelectOption key="statusDown" value="Down" />,
      <SelectOption key="statusDegraded" value="Degraded" />,
      <SelectOption key="statusMaint" value="Needs Maintainence" />
    ];

    return (
      <React.Fragment>
        <ToolbarFilter
          chips={filters.location}
          deleteChip={this.onDelete}
          categoryName="Location"
          showToolbarItem={currentCategory === 'Location'}
        >
          <Select
            aria-label="Location"
            onToggle={this.onFilterToggle}
            onSelect={this.onLocationSelect}
            selections={filters.location[0]}
            isOpen={isFilterDropdownOpen}
            placeholderText="Any"
          >
            {locationMenuItems}
          </Select>
        </ToolbarFilter>
        <ToolbarFilter
          chips={filters.name}
          deleteChip={this.onDelete}
          categoryName="Name"
          showToolbarItem={currentCategory === 'Name'}
        >
          <InputGroup>
            <TextInput
              name="nameInput"
              id="nameInput1"
              type="search"
              aria-label="name filter"
              onChange={this.onInputChange}
              value={inputValue}
              placeholder="Filter by name..."
              onKeyDown={this.onNameInput}
            />
            <Button
              variant={ButtonVariant.control}
              aria-label="search button for search input"
              onClick={this.onNameInput}
            >
              <SearchIcon />
            </Button>
          </InputGroup>
        </ToolbarFilter>
        <ToolbarFilter
          chips={filters.status}
          deleteChip={this.onDelete}
          categoryName="Status"
          showToolbarItem={currentCategory === 'Status'}
        >
          <Select
            variant={SelectVariant.checkbox}
            aria-label="Status"
            onToggle={this.onFilterToggle}
            onSelect={this.onStatusSelect}
            selections={filters.status}
            isOpen={isFilterDropdownOpen}
            placeholderText="Filter by status"
          >
            {statusMenuItems}
          </Select>
        </ToolbarFilter>
      </React.Fragment>
    );
  }

  buildSelectDropdown() {
    const { isBulkSelectDropdownOpen } = this.state;

    return (
      <Dropdown
        position="left"
        toggle={
          <DropdownToggle
            splitButtonItems={[
              <DropdownToggleCheckbox
                id="example-checkbox-2"
                key="split-checkbox"
              ></DropdownToggleCheckbox>
            ]}
            onToggle={this.onBulkSelectDropdownToggle}
          />
        }
        isOpen={isBulkSelectDropdownOpen}
      />
    );
  }

  renderAddButton() {
    return (
      <Button variant="primary" onClick={() => this.setState({ isWizardOpen: true })}>
        Add data capture
      </Button>
    )
  }

  renderToolbar() {
    return (
      <Toolbar
        id="toolbar-with-chip-groups"
        clearAllFilters={this.onDelete}
        collapseListedFiltersBreakpoint="xl"
      >
        <ToolbarContent>
          <ToolbarItem variant="bulk-select">
            {this.buildSelectDropdown()}
          </ToolbarItem>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
            <ToolbarGroup variant="filter-group">
              {this.buildCategoryDropdown()}
              {this.buildFilterDropdown()}
            </ToolbarGroup>
          </ToolbarToggleGroup>
          <ToolbarItem>
            {this.renderAddButton()}
          </ToolbarItem>
          <ToolbarGroup variant="icon-button-group">
            <ToolbarItem>
              <Button variant="plain">
                <ExportIcon />
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button variant="plain">
                <EllipsisVIcon />
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
    );
  }

  render() {
    const { rows, columns, filters, isDrawerExpanded, isWizardOpen } = this.state;

    const filteredRows =
      filters.name.length > 0 || filters.location.length > 0 || filters.status.length > 0
        ? rows.filter(row => {
            return (
              (filters.name.length === 0 ||
                filters.name.some(name => row.cells[0].toLowerCase().includes(name.toLowerCase()))) &&
              (filters.location.length === 0 || filters.location.includes(row.cells[5])) &&
              (filters.status.length === 0 || filters.status.includes(row.cells[4]))
            );
          })
        : rows;

    return (
      <React.Fragment>
        {isWizardOpen && (
          <Modal
            isOpen
            variant="large"
            showClose={false}
            hasNoBodyWrapper
            title="Add data capture"
            aria-label="Add data capture"
          >
            <DebeziumWizard
              onSave={() => this.setState({ rows: dataCapturesToRows(getDataCaptures()), isWizardOpen: false })}
              onClose={() => this.setState({ isWizardOpen: false })}
            />
          </Modal>
        )}
        {rows.length === 0
          ? (
            <EmptyState variant="xl">
              <EmptyStateIcon icon={ExchangeAltIcon} />
              <Title headingLevel="h4" size="lg">
                You haven't created any data captures yet.
              </Title>
              <EmptyStateBody>
                Create a data capture to get started.
              </EmptyStateBody>
              {this.renderAddButton()}
            </EmptyState>
          )
          : (
            <React.Fragment>
              {this.renderToolbar()}
              <Table
                cells={columns}
                rows={filteredRows}
                onSelect={this.onRowSelect}
                aria-label="Filterable Table Demo"
                actions={this.actions}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
}

export default DebeziumTable;
