import json
import boto3
import time

athena_client = boto3.client("athena")

ATHENA_DB = "wildfire_db4"
ATHENA_OUTPUT = "s3://wildfire-data2/query_output/" 

def lambda_handler(event, context):
    # Get year param (optional)
    year = None
    if "queryStringParameters" in event and event["queryStringParameters"]:
        year = event["queryStringParameters"].get("year")

    if year:
        query = f"""
            SELECT firename, totalacres, fireyear, statcause
            FROM firedata
            WHERE fireyear = {year} and fireyear <2025 and fireyear >1974
            ORDER BY totalacres DESC
            LIMIT 20;
        """
    else:
        query = """
            SELECT firename, totalacres, fireyear, statcause
            FROM firedata
            WHERE fireyear <2025 and fireyear >1974
            ORDER BY totalacres DESC
            LIMIT 20;
        """

    # Run Athena query
    response = athena_client.start_query_execution(
        QueryString=query,
        QueryExecutionContext={"Database": ATHENA_DB},
        ResultConfiguration={"OutputLocation": ATHENA_OUTPUT},
    )

    query_execution_id = response["QueryExecutionId"]

    # Wait for query to finish
    while True:
        status = athena_client.get_query_execution(QueryExecutionId=query_execution_id)
        state = status["QueryExecution"]["Status"]["State"]
        if state in ["SUCCEEDED", "FAILED", "CANCELLED"]:
            break
        time.sleep(1)

    if state != "SUCCEEDED":
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "GET,OPTIONS"
            },
            "body": json.dumps({"error": "Athena query failed"})
        }

    # Get results
    results = athena_client.get_query_results(QueryExecutionId=query_execution_id)

    fires = []
    for row in results["ResultSet"]["Rows"][1:]:  # skip header row
        data = row["Data"]
        fires.append({
            "firename": data[0].get("VarCharValue", ""),
            "size_acres": float(data[1].get("VarCharValue", "0")),
            "fireyear": data[2].get("VarCharValue", ""),
            "statcause": data[3].get("VarCharValue", "")
        })

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,OPTIONS"
        },
        "body": json.dumps(fires)
    }