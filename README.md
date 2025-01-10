# nwcs-inventory

## Description

nwcs-inventory is a modern, web-based inventory management system developed to solve the challenges of managing computer equipment at Northwestern College. The existing system—an old, clunky Access database—lacked essential features such as multi-user access, data visualizations, and user-friendly interfaces. By developing nwcs-inventory, the goal is to create a streamlined, efficient system that empowers staff to easily track and manage equipment across the campus.

This system is designed with user-friendliness in mind, making it easy for staff members to manage device assignments, monitor device statuses, and gain insights through data visualizations, which were previously unavailable. The new system eliminates the restrictions of old technology, allowing multiple users to access and update information simultaneously, providing a more collaborative and efficient workflow.

## Key Features

* Multi-User Access: No restrictions on concurrent users—anyone with appropriate access can update and manage the system in real time.
* Device Tracking: Track equipment with relevant information like asset tags, serial numbers, locations, status, and warranty details.
* User-Friendly Interface: Clean, modern web-based interface for easy navigation and operation.
* Data Visualizations: Interactive dashboards, graphs, and reports to visualize the status of devices, their locations, and more.
* Device Status Management: Track and update the status of each device (e.g., available, in use, damaged, etc.) to ensure accurate information.
* Search & Filtering: Simple yet powerful search and filtering capabilities to quickly find devices based on criteria like asset tags, device status, or location.

## MVP (Minimum Viable Product)

The MVP for nwcs-inventory will focus on the essential features required for basic inventory management. The goal is to have a working version of the system that can handle device tracking, user assignments, and data visualization at a basic level.

### Core MVP Features

* Device Tracking:
  * Track devices with key information like asset tags, serial numbers, location, status, and warranty status.
* Multi-User Access:
  * Allow multiple users to access and manage data concurrently (no single-user restriction).
* Device Status Management:
  * Users can change the status of devices (e.g., available, in use, damaged).
* Search & Filtering:
  * Users can search and filter devices based on asset tags, device status, and location.
* Data Visualizations:
  * Provide basic dashboards and simple visualizations (e.g., total devices by status, devices by location).
* Basic User Roles:
  * Administrator role with full access.
  * Regular user role with restricted access to device management (CRUD operations).

## Future Considerations

As the system evolves, several additional features and improvements could be implemented to expand the capabilities and make the system even more efficient. Here are some potential future considerations for **nwcs-inventory**:

### Advanced Features

* **Mobile-Friendly Interface:**
  * Implement a responsive, mobile-friendly design to allow users to access the system from any device.
* **Scanner Integration:**
  * Integrate barcode/QR code scanners to quickly add, assign, or track devices by scanning their unique identifiers.
* **Warranty Tracking & Alerts:**
  * Implement automatic tracking of device warranties and send alerts when devices are nearing warranty expiration.
* **Device History:**
  * Create an **equipment_history** table to store past assignments, statuses, and location changes for each device.
* **Batch Import:**
  * Add functionality for bulk imports (e.g., via CSV files) to make data entry more efficient when adding new devices.
* **Custom Reports:**
  * Allow administrators to define custom filters and fields to generate tailored reports based on their needs.
* **Audit Trails:**
  * Implement an audit trail to track who made changes to the data (e.g., device assignments, status changes) and when.
* **Device Disposal Management:**
  * Add a workflow for handling retired or disposed devices, including fields for disposal reasons (damaged, replaced, donated), disposal date, and optional notes.
* **Advanced Search & Filtering:**
  * Add more granular search filters, such as searching by device specifications (RAM, storage, OS).
* **Data Backup & Versioning:**
  * Implement automated weekly backups and versioned backups to prevent data loss.

### AI-Powered Features

* **AI-Powered Search Suggestions:**
  * Implement an intelligent search system that uses machine learning to suggest devices based on previous searches, device attributes, and user behavior, reducing search time and improving efficiency.
* **Predictive Maintenance Alerts:**
  * Use machine learning models to analyze device usage patterns and predict when maintenance or replacement might be needed, allowing for proactive equipment management and reducing downtime.
* **AI-Powered Reporting:**
  * Develop an AI-based report generation system that can automatically suggest insightful reports or generate custom reports based on patterns detected in the device data (e.g., frequently used devices, devices with frequent issues).
* **Natural Language Processing (NLP) for Device Queries:**
  * Implement an NLP-based query system that allows users to ask questions in natural language (e.g., "Which devices are nearing warranty expiration?" or "Show devices in Room 101"), and the system can respond with relevant data.
* **AI-Enhanced Device Assignment Recommendations:**
  * Use AI to suggest device assignments based on historical patterns, user roles, and device usage trends, streamlining the process for staff.
