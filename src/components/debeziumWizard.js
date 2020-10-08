import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Gallery,
  GalleryItem,
  Grid,
  GridItem,
  Popover,
  TextInput,
  Title,
  Wizard
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import logoMysql from '../images/logo-mysql.png';
import logoMongDb from '../images/logo-mongodb.png';
import logoPostgres from '../images/logo-postgres.png';
import logoMssql from '../images/logo-mssql.png';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import "./debeziumWizard.css";

const DebeziumWizard = ({ onSave }) => {
  const [connector, setConnector] = React.useState('mysql');
  const [table, setTable] = React.useState('Select');
  const [streamName, setStreamName] = React.useState('');

  const SelectConnector = (
    <Gallery hasGutter>
      <GalleryItem>
        <Card className={css("app-c-selectable-card", connector === 'mysql' && 'app-m-focus')} isSelectable={true} onClick={() => setConnector('mysql')}>
          <CardHeader >
            <CardHeaderMain>
              <img
                src={logoMysql}
                alt="mysql" />
            </CardHeaderMain>
          </CardHeader>
          <CardTitle>MySQL</CardTitle>
          <CardBody isFilled={false}>Connection to MySQL</CardBody>
        </Card>
      </GalleryItem>
      <GalleryItem>
        <Card className={css("app-c-selectable-card", connector === 'postgres' && 'app-m-focus')} isSelectable={true} onClick={() => setConnector('postgres')}>
          <CardHeader>
            <CardHeaderMain>
              <img
                src={logoPostgres}
                alt="postgres db" />
            </CardHeaderMain>
          </CardHeader>
          <CardTitle>PostgresDB</CardTitle>
          <CardBody>Connection to SampleDB</CardBody>
        </Card>
      </GalleryItem>
      <GalleryItem>
        <Card className={css("app-c-selectable-card", connector === 'mongodb' && 'app-m-focus')} isSelectable={true} onClick={() => setConnector('mongodb')}>
          <CardHeader>
            <CardHeaderMain>
              <img
                src={logoMongDb}
                alt="mongo db" />
            </CardHeaderMain>
          </CardHeader>
          <CardTitle>MongoDB</CardTitle>
          <CardBody>Connection to SampleDB</CardBody>
        </Card>
      </GalleryItem>
      <GalleryItem>
        <Card className={css("app-c-selectable-card", connector === 'microsoftsql' && 'app-m-focus')} isSelectable={true} onClick={() => setConnector('microsoftsql')}>
          <CardHeader>
            <CardHeaderMain>
              <img
                src={logoMssql}
                alt="SQL server" />
            </CardHeaderMain>
          </CardHeader>
          <CardTitle>SQL Server</CardTitle>
          <CardBody>Connection to SampleDB</CardBody>
        </Card>
      </GalleryItem>
    </Gallery>
  )

  const ConfigureConnection = (
    <React.Fragment>
      <Form>
        <Title size="2xl" headingLevel="h2">
          Configure Connection
        </Title>
        <FormGroup
          label="Name"
          labelIcon={
            <Popover
              headerContent={
                <div>
                  Header
                </div>
              }
              bodyContent={
                <div>
                  Body
                </div>
              }
            >
              <button
                aria-label="More info for name field"
                onClick={e => e.preventDefault()}
                aria-describedby="simple-form-name"
                className="pf-c-form__group-label-help"
              >
                <HelpIcon noVerticalAlign />
              </button>
            </Popover>
          }
          isRequired
          fieldId="simple-form-name"
          helperText="Please provide your full name"
        >
          <TextInput
            isRequired
            type="text"
            id="simple-form-name"
            name="simple-form-name"
            aria-describedby="simple-form-name-helper"
            // value=""
            // onChange={sel => setTable(sel)}
            // onChange={this.handleTextInputChange1}
          />
        </FormGroup>
        <Grid hasGutter>
          <GridItem sm={10}>
            <FormGroup
              label="Connection URL"
              labelIcon={
                <Popover
                  headerContent={
                    <div>
                      Header
                    </div>
                  }
                  bodyContent={
                    <div>
                      Body
                    </div>
                  }
                >
                  <button
                    aria-label="More info for name field"
                    onClick={e => e.preventDefault()}
                    aria-describedby="simple-form-name"
                    className="pf-c-form__group-label-help"
                  >
                    <HelpIcon noVerticalAlign />
                  </button>
                </Popover>
              }
              isRequired
              fieldId="configure-connection-url"
              helperText="Please provide your full name"
              isRequired
            >
              <TextInput
                isRequired
                type="url"
                id="configure-connection-url"
                name="configure-connection-url"
                // value=""
                // onChange={this.handleTextInputChange2}
              />
            </FormGroup>
          </GridItem>
          <GridItem sm={2}>
            <FormGroup label="Port" isRequired fieldId="configure-connection-port">
              <TextInput
                isRequired
                type="text"
                id="configure-connection-port"
                name="configure-connection-port"
                // value=""
                // onChange={this.handleTextInputChange2}
              />
            </FormGroup>
          </GridItem>
        </Grid>
        <FormGroup label="Password" isRequired fieldId="configure-connection-password">
          <TextInput
            isRequired
            type="url"
            id="configure-connection-password"
            name="configure-connection-password"
            // value=""
            // onChange={this.handleTextInputChange2}
          />
        </FormGroup>
        <FormGroup label="Database name" isRequired fieldId="configure-connection-database-name">
          <TextInput
            isRequired
            type="url"
            id="configure-connection-database-name"
            name="configure-connection-database-name"
            // value=""
            // onChange={this.handleTextInputChange2}
          />
        </FormGroup>
        <FormGroup label="Namespace of server/cluster" isRequired fieldId="configure-connection-namespace-server-cluster">
          <TextInput
            isRequired
            type="url"
            id="configure-connection-namespace-server-cluster"
            name="configure-connection-namespace-server-cluster"
            // value=""
            // onChange={this.handleTextInputChange2}
          />
        </FormGroup>
      </Form>
    </React.Fragment>
  )

  const CreateStream = (
    <React.Fragment>
      <Form isHorizontal>
        <Title size="2xl" headingLevel="h2">
          Create stream
        </Title>
        <FormGroup
          label="Stream name"
          fieldId="simple-stream-name"
        >
          <TextInput
            value={streamName}
            onChange={val => setStreamName(val)}
            isRequired
            type="text"
            id="simple-stream-name"
            name="simple-stream-name"
            aria-describedby="simple-form-name-helper"
          />
        </FormGroup>
        <FormGroup
          label="Table name"
          fieldId="simple-form-name"
        >
          <FormSelect
            value={table}
            onChange={sel => setTable(sel)}
            id="horzontal-form-title"
            name="horizontal-form-title"
            aria-label="Your title"
          >
            <FormSelectOption value="Select" label="Select" />
            <FormSelectOption value="trades" label="trades" />
            <FormSelectOption value="music" label="music" />
          </FormSelect>
        </FormGroup>
      </Form>
    </React.Fragment>
  )

  const wizardSteps = [
    { name: 'Select connector',
      component: SelectConnector
    },
    { name: 'Configure connection',
      component: ConfigureConnection
    },
    { name: 'Create stream',
      component: CreateStream,
      nextButtonText: 'Finish'
    },
  ];

  return (
    <Wizard
      // if step is select connector, apply 'pf-m-color-scheme-light-200'
      className='pf-m-color-scheme-light-200'
      // else omit this className
      steps={wizardSteps}
      onSave={() => {
        // use localstorage to fake a db for now
        let dataCaptures = localStorage.getItem('dataCaptures')
        dataCaptures = dataCaptures ? JSON.parse(dataCaptures) : [];
        dataCaptures.push({
          name: streamName,
          namespace: 'Default',
          connector: 'MySQL',
          connectorURL: 'trades-db.rds.aws.amazon.com',
          connectorPort: '3306',
          databaseName: 'trades'
        })
        localStorage.setItem('dataCaptures', JSON.stringify(dataCaptures));
        onSave();
      }}
    />
  )
}

export default DebeziumWizard;