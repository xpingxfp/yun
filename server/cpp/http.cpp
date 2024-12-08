#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/beast/version.hpp>
#include <boost/asio/ip/tcp.hpp>
#include <boost/filesystem.hpp>
#include <iostream>
#include <string>

namespace http = boost::beast::http;
namespace fs = boost::filesystem;

// 处理HTTP请求
void handle_request(http::request<http::string_body> req, http::response<http::string_body> &res)
{
    // 禁止POST请求
    if (req.method() != http::verb::get)
    {
        res.result(http::status::method_not_allowed);
        res.set(http::field::content_type, "text/plain");
        res.body() = "Method Not Allowed";
        return;
    }

    std::string path = "."; // 服务器根目录
    if (req.target() == "/")
    {
        path += "/index.html";
    }
    else
    {
        path += req.target().to_string();
    }

    try
    {
        if (fs::is_directory(path))
        {
            res.result(http::status::forbidden);
            res.set(http::field::content_type, "text/plain");
            res.body() = "Forbidden";
            return;
        }

        std::ifstream is(path, std::ios::in | std::ios::binary);
        if (!is)
        {
            res.result(http::status::not_found);
            res.set(http::field::content_type, "text/plain");
            res.body() = "Not Found";
            return;
        }

        // Read the file content into the response body
        std::ostringstream ostr;
        ostr << is.rdbuf();
        res.body() = ostr.str();

        // Set MIME type based on file extension
        std::string ext = fs::extension(path);
        if (ext == ".html" || ext == ".htm")
            res.set(http::field::content_type, "text/html");
        else if (ext == ".css")
            res.set(http::field::content_type, "text/css");
        else if (ext == ".js")
            res.set(http::field::content_type, "application/javascript");
        else if (ext == ".json")
            res.set(http::field::content_type, "application/json");
        else if (ext == ".jpg" || ext == ".jpeg")
            res.set(http::field::content_type, "image/jpeg");
        else if (ext == ".png")
            res.set(http::field::content_type, "image/png");
        else if (ext == ".svg")
            res.set(http::field::content_type, "image/svg+xml");
        else if (ext == ".ico")
            res.set(http::field::content_type, "image/x-icon");
        else if (ext == ".txt")
            res.set(http::field::content_type, "text/plain");
        else
            res.set(http::field::content_type, "application/octet-stream");

        res.result(http::status::ok);
    }
    catch (const std::exception &e)
    {
        res.result(http::status::internal_server_error);
        res.set(http::field::content_type, "text/plain");
        res.body() = "Internal Server Error";
    }
}

// 主函数
int main()
{
    namespace ip = boost::asio::ip;
    using tcp = ip::tcp;

    try
    {
        boost::asio::io_context ioc{1};
        tcp::acceptor acceptor{ioc, {tcp::v4(), 3000}};

        for (;;)
        {
            tcp::socket socket{ioc};
            acceptor.accept(socket);

            http::request<http::string_body> req;
            http::response<http::string_body> res;

            // Parse the request
            http::read(socket, boost::beast::basic_flat_buffer(), req);

            // Process the request and prepare the response
            handle_request(req, res);

            // Send the response
            http::write(socket, res);
        }
    }
    catch (const std::exception &e)
    {
        std::cerr << "Error: " << e.what() << "\n";
    }

    return 0;
}