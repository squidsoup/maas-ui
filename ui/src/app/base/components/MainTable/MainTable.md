### Default

```jsx
<MainTable
  headers={[
    { content: null },
    { content: "Foundation Cloud" },
    { content: "Foundation Cloud Plus" }
  ]}
  rows={[
    {
      columns: [
        {
          content: "Expert delivery of an Ubuntu OpenStack cloud",
          role: "rowheader"
        },
        { content: "Reference architecture" },
        { content: "Custom architecture" }
      ]
    },
    {
      columns: [
        { content: "Workshop and training", role: "rowheader" },
        { content: "2-days" },
        { content: "4-days" }
      ]
    },
    {
      columns: [
        { content: "One-time price", role: "rowheader" },
        { content: "$75,000" },
        { content: "$150,000" }
      ]
    }
  ]}
/>
```

### Sortable

```jsx
<MainTable
  headers={[
    { content: "Status", sortKey: "status" },
    { content: "Cores", sortKey: "cores", className: "u-align--right" },
    { content: "RAM", sortKey: "ram", className: "u-align--right" },
    { content: "Disks", sortKey: "disks", className: "u-align--right" }
  ]}
  rows={[
    {
      columns: [
        { content: "Ready", role: "rowheader" },
        { content: 1, className: "u-align--right" },
        { content: "1 GiB", className: "u-align--right" },
        { content: 2, className: "u-align--right" }
      ],
      sortData: {
        status: "ready",
        cores: 2,
        ram: 1,
        disks: 2
      }
    },
    {
      columns: [
        { content: "Idle", role: "rowheader" },
        { content: 1, className: "u-align--right" },
        { content: "1 GiB", className: "u-align--right" },
        { content: 2, className: "u-align--right" }
      ],
      sortData: {
        status: "idle",
        cores: 1,
        ram: 1,
        disks: 2
      }
    },
    {
      columns: [
        { content: "Waiting", role: "rowheader" },
        { content: 8, className: "u-align--right" },
        { content: "3.9 GiB", className: "u-align--right" },
        { content: 3, className: "u-align--right" }
      ],
      sortData: {
        status: "waiting",
        cores: 8,
        ram: 3.9,
        disks: 3
      }
    }
  ]}
  sortable
/>
```

### Expanding

```jsx
import Row from "../Row";
import Col from "../Col";
// Expanded should be handled in your parent component.
initialState = { expandedRow: null };
<MainTable
  expanding
  headers={[
    { content: "Name" },
    { content: "Mac address" },
    { content: "IP" },
    { content: "Rack" },
    { content: "Last seen" },
    { content: "Actions", className: "u-align--right" }
  ]}
  rows={[
    {
      columns: [
        { content: "Unknown", role: "rowheader" },
        { content: "2c:44:fd:80:3f:25" },
        { content: "10.249.0.1" },
        { content: "karura" },
        { content: "Thu, 25 Oct. 2018 13:55:21" },
        {
          content: (
            <button
              className="u-toggle"
              onClick={() =>
                setState({
                  expandedRow: 1
                })
              }
            >
              Show
            </button>
          ),
          className: "u-align--right"
        }
      ],
      expanded: state.expandedRow === 1,
      expandedContent: (
        <Row>
          <Col size="8">
            <h4>Expanding table cell</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Consequuntur cum dicta beatae nostrum eligendi similique earum,
              dolorem fuga quis, sequi voluptates architecto ipsa dolorum eaque
              rem expedita inventore voluptas odit aspernatur alias molestias
              facere.
            </p>
          </Col>
        </Row>
      )
    },
    {
      columns: [
        { content: "Unknown", role: "rowheader" },
        { content: "52:54:00:3a:fe:e9" },
        { content: "172.16.99.191" },
        { content: "karura" },
        { content: "Wed, 3 Oct. 2018 23:08:06" },
        {
          content: (
            <button
              className="u-toggle"
              onClick={() =>
                setState({
                  expandedRow: 2
                })
              }
            >
              Show
            </button>
          ),
          className: "u-align--right"
        }
      ],
      expanded: state.expandedRow === 2,
      expandedContent: (
        <Row>
          <Col size="8">
            <h4>Expanding table cell</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Consequuntur cum dicta beatae nostrum eligendi similique earum,
              dolorem fuga quis, sequi voluptates architecto ipsa dolorum eaque
              rem expedita inventore voluptas odit aspernatur alias molestias
              facere.
            </p>
          </Col>
        </Row>
      )
    },
    {
      columns: [
        { content: "Unknown", role: "rowheader" },
        { content: "52:54:00:74:c2:10" },
        { content: "172.16.99.192" },
        { content: "karura" },
        { content: "Wed, 17 Oct. 2018 12:18:18" },
        {
          content: (
            <button
              className="u-toggle"
              onClick={() =>
                setState({
                  expandedRow: 3
                })
              }
            >
              Show
            </button>
          ),
          className: "u-align--right"
        }
      ],
      expanded: state.expandedRow === 3,
      expandedContent: (
        <Row>
          <Col size="8">
            <h4>Expanding table cell</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Consequuntur cum dicta beatae nostrum eligendi similique earum,
              dolorem fuga quis, sequi voluptates architecto ipsa dolorum eaque
              rem expedita inventore voluptas odit aspernatur alias molestias
              facere.
            </p>
          </Col>
        </Row>
      )
    }
  ]}
/>;
```

### Responsive

```jsx
<MainTable
  headers={[
    { content: "Name" },
    { content: "Users", className: "u-align--right" },
    { content: "Units", className: "u-align--right" }
  ]}
  rows={[
    {
      columns: [
        { content: "Ready", role: "rowheader", "aria-label": "Name" },
        { content: 1, "aria-label": "Users", className: "u-align--right" },
        { content: "1 GiB", "aria-label": "Units", className: "u-align--right" }
      ]
    },
    {
      columns: [
        { content: "Ready", role: "rowheader", "aria-label": "Name" },
        { content: 1, "aria-label": "Users", className: "u-align--right" },
        { content: "1 GiB", "aria-label": "Units", className: "u-align--right" }
      ]
    },
    {
      columns: [
        { content: "Ready", role: "rowheader", "aria-label": "Name" },
        { content: 1, "aria-label": "Users", className: "u-align--right" },
        { content: "1 GiB", "aria-label": "Units", className: "u-align--right" }
      ]
    }
  ]}
  responsive
/>
```